// POST /api/quest/[id]/complete - Hoàn thành quest (SUCCESS/FAILED)
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { authenticateRequest, GAME_CONSTANTS } from '@/lib/auth';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = authenticateRequest(request);
    if (!auth) {
      return NextResponse.json({ error: 'Chưa đăng nhập' }, { status: 401 });
    }

    const { id } = await params;
    const questId = parseInt(id);
    const { status } = await request.json(); // 'SUCCESS' or 'FAILED'

    if (!['SUCCESS', 'FAILED'].includes(status)) {
      return NextResponse.json({ error: 'Status phải là SUCCESS hoặc FAILED' }, { status: 400 });
    }

    // Get quest
    const quest = await prisma.dailyQuest.findFirst({
      where: { id: questId, userId: auth.userId },
      include: { bossConfig: true },
    });

    if (!quest) {
      return NextResponse.json({ error: 'Không tìm thấy quest' }, { status: 404 });
    }

    if (quest.status !== 'PENDING') {
      return NextResponse.json({ error: 'Quest đã hoàn thành rồi' }, { status: 400 });
    }

    // Update quest status
    await prisma.dailyQuest.update({
      where: { id: questId },
      data: { status },
    });

    // Update user based on result
    const user = await prisma.user.findUnique({ where: { id: auth.userId } });
    if (!user) {
      return NextResponse.json({ error: 'Không tìm thấy người chơi' }, { status: 404 });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updates: Record<string, any> = {};
    let smugglerPenaltyApplied = 0;
    let actualGoldReward = quest.rewardGold;

    if (status === 'SUCCESS') {
      let goldReward = quest.rewardGold;

      // Apply smuggler penalty if active (15% gold reduction)
      if (user.smugglerPenalty > 0) {
        smugglerPenaltyApplied = Math.floor(goldReward * user.smugglerPenalty);
        goldReward -= smugglerPenaltyApplied;
      }
      actualGoldReward = goldReward;

      updates.gold = { increment: goldReward };
      updates.exp = { increment: quest.isBoss ? GAME_CONSTANTS.BOSS_SUCCESS_EXP : GAME_CONSTANTS.SUCCESS_EXP };
    } else {
      // FAILED - trừ uy tín
      const penalty = quest.isBoss
        ? GAME_CONSTANTS.BOSS_FAIL_HEALTH_PENALTY
        : GAME_CONSTANTS.FAIL_HEALTH_PENALTY;
      const newHealth = Math.max(0, user.garageHealth - penalty);
      updates.garageHealth = newHealth;
    }

    const updatedUser = await prisma.user.update({
      where: { id: auth.userId },
      data: updates,
    });

    // ============================================================
    // ENDING CHECKS
    // ============================================================
    let gameOver = false;
    let ending: string | null = null;

    // 1. Wasted Potential - Uy tín = 0
    if (updatedUser.garageHealth <= 0) {
      gameOver = true;
      ending = 'Wasted Potential';
    }

    // 2. Final Round endings
    if (!gameOver && user.isFinalRound) {
      // Get all Final Round quests (day 51)
      const finalQuests = await prisma.dailyQuest.findMany({
        where: { userId: auth.userId, dayNumber: 51 },
        include: { bossConfig: true },
      });

      if (status === 'FAILED' && quest.isBoss) {
        // Check for Boss Hidden Ending (specific boss fail)
        const bossName = quest.bossConfig?.name;
        if (bossName === 'Kẻ Bí Ẩn') {
          ending = 'Bóng Ma Tốc Độ';
        } else {
          // The Missing Percent - Fail bất kỳ boss nào trong Final Round
          ending = 'The Missing Percent';
        }
        gameOver = true;
      }

      // Check if all Final Round quests are completed
      const allCompleted = finalQuests.every(
        (q) => q.status === 'SUCCESS' || q.status === 'FAILED'
      );
      const allSuccess = finalQuests.every((q) => q.status === 'SUCCESS');

      if (allCompleted && allSuccess && finalQuests.length >= GAME_CONSTANTS.FINAL_ROUND_BOSSES) {
        // Invictus - Thắng hết 10 Boss
        ending = 'Invictus';
        gameOver = true;
      }
    }

    // Unlock ending if earned
    if (ending) {
      const endingRecord = await prisma.ending.findFirst({
        where: { name: ending },
      });
      if (endingRecord) {
        await prisma.userEnding.upsert({
          where: { userId_endingId: { userId: auth.userId, endingId: endingRecord.id } },
          create: { userId: auth.userId, endingId: endingRecord.id },
          update: {},
        });
      }
    }

    return NextResponse.json({
      message: status === 'SUCCESS'
        ? (smugglerPenaltyApplied > 0
          ? `Hoàn thành xuất sắc! +${actualGoldReward} vàng (🕶️ Tay Buôn Lậu lấy ${smugglerPenaltyApplied} vàng)`
          : `Hoàn thành xuất sắc! +${quest.rewardGold} vàng`)
        : 'Xe nổ máy! Uy tín giảm...',
      questStatus: status,
      rewards: status === 'SUCCESS' ? {
        gold: actualGoldReward,
        originalGold: quest.rewardGold,
        smugglerPenalty: smugglerPenaltyApplied,
        exp: quest.isBoss ? GAME_CONSTANTS.BOSS_SUCCESS_EXP : GAME_CONSTANTS.SUCCESS_EXP,
      } : null,
      penalty: status === 'FAILED' ? {
        healthLost: quest.isBoss
          ? GAME_CONSTANTS.BOSS_FAIL_HEALTH_PENALTY
          : GAME_CONSTANTS.FAIL_HEALTH_PENALTY,
      } : null,
      userState: {
        gold: Number(updatedUser.gold),
        garageHealth: updatedUser.garageHealth,
        exp: Number(updatedUser.exp),
      },
      gameOver,
      ending,
      isFinalRound: user.isFinalRound,
    });

  } catch (error) {
    console.error('Complete quest error:', error);
    return NextResponse.json({ error: 'Lỗi server' }, { status: 500 });
  }
}

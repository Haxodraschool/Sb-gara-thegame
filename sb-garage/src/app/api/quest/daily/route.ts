// GET /api/quest/daily - Lấy quest hôm nay
// POST /api/quest/daily - Generate quest cho ngày mới
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { authenticateRequest, GAME_CONSTANTS, randomInt } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const auth = authenticateRequest(request);
    if (!auth) {
      return NextResponse.json({ error: 'Chưa đăng nhập' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ where: { id: auth.userId } });
    if (!user) {
      return NextResponse.json({ error: 'Không tìm thấy người chơi' }, { status: 404 });
    }

    const quests = await prisma.dailyQuest.findMany({
      where: {
        userId: auth.userId,
        dayNumber: user.currentDay,
      },
      include: {
        bossConfig: true,
      },
      orderBy: { id: 'asc' },
    });

    return NextResponse.json({
      currentDay: user.currentDay,
      garageHealth: user.garageHealth,
      gold: Number(user.gold),
      quests: quests.map((q) => ({
        id: q.id,
        dayNumber: q.dayNumber,
        isBoss: q.isBoss,
        bossConfig: q.bossConfig ? {
          name: q.bossConfig.name,
          description: q.bossConfig.description,
          specialCondition: q.bossConfig.specialCondition,
          imageUrl: q.bossConfig.imageUrl,
        } : null,
        requiredPower: q.requiredPower,
        rewardGold: q.rewardGold,
        status: q.status,
      })),
      totalShadows: quests.length,
      completed: quests.filter((q) => q.status !== 'PENDING').length,
      pending: quests.filter((q) => q.status === 'PENDING').length,
    });

  } catch (error) {
    console.error('Daily quest error:', error);
    return NextResponse.json({ error: 'Lỗi server' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = authenticateRequest(request);
    if (!auth) {
      return NextResponse.json({ error: 'Chưa đăng nhập' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ where: { id: auth.userId } });
    if (!user) {
      return NextResponse.json({ error: 'Không tìm thấy người chơi' }, { status: 404 });
    }

    // Check if quests already generated for current day
    const existingQuests = await prisma.dailyQuest.count({
      where: { userId: auth.userId, dayNumber: user.currentDay },
    });
    if (existingQuests > 0) {
      return NextResponse.json(
        { error: 'Quest ngày hôm nay đã được tạo rồi!' },
        { status: 400 }
      );
    }

    // Determine number of customers
    let customerCount: number;
    const isBossDay = user.currentDay % GAME_CONSTANTS.BOSS_INTERVAL === 0;

    if (user.currentDay <= GAME_CONSTANTS.FIXED_QUEST_DAYS) {
      // Ngày 1-5: số lượng khách cố định
      customerCount = Math.min(user.currentDay, 4);
    } else {
      // Ngày 6+: Random
      const config = await prisma.questConfig.findFirst({
        where: {
          minLevel: { lte: user.level },
          maxLevel: { gte: user.level },
        },
      });
      customerCount = config
        ? randomInt(config.minCustomers, config.maxCustomers)
        : randomInt(2, 5);
    }

    // Get quest config for power/gold range
    const questConfig = await prisma.questConfig.findFirst({
      where: {
        minLevel: { lte: user.level },
        maxLevel: { gte: user.level },
      },
    });

    const questsData = [];

    // Generate normal customer quests
    for (let i = 0; i < customerCount; i++) {
      questsData.push({
        userId: auth.userId,
        dayNumber: user.currentDay,
        isBoss: false,
        requiredPower: questConfig
          ? randomInt(questConfig.minPowerReq, questConfig.maxPowerReq)
          : randomInt(100, 300),
        rewardGold: questConfig
          ? randomInt(questConfig.minGoldReward, questConfig.maxGoldReward)
          : randomInt(50, 200),
        status: 'PENDING' as const,
      });
    }

    // Add boss if boss day
    if (isBossDay) {
      const bosses = await prisma.bossConfig.findMany();
      if (bosses.length > 0) {
        const randomBoss = bosses[Math.floor(Math.random() * bosses.length)];
        questsData.push({
          userId: auth.userId,
          dayNumber: user.currentDay,
          isBoss: true,
          bossConfigId: randomBoss.id,
          requiredPower: randomBoss.requiredPower,
          rewardGold: randomBoss.rewardGold,
          status: 'PENDING' as const,
        });
      }
    }

    await prisma.dailyQuest.createMany({ data: questsData });

    return NextResponse.json({
      message: `Ngày ${user.currentDay} bắt đầu! ${customerCount} khách hàng${isBossDay ? ' + 1 BOSS' : ''} đã đến.`,
      currentDay: user.currentDay,
      totalShadows: questsData.length,
      isBossDay,
    });

  } catch (error) {
    console.error('Generate quest error:', error);
    return NextResponse.json({ error: 'Lỗi server' }, { status: 500 });
  }
}

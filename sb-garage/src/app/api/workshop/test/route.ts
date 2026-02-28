// POST /api/workshop/test - Chạy thử xe (Core Gameplay)
// Nhận 10 card IDs, mô phỏng sequential test run
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { authenticateRequest, GAME_CONSTANTS } from '@/lib/auth';

interface TestStep {
  slot: number;
  cardId: number;
  cardName: string;
  cardType: string;
  rarity: number;
  powerAdded: number;
  heatAdded: number;
  stabilityReduced: number;
  comboTriggered: boolean;
  comboEffect: string | null;
  comboValue: number;
  effectTriggered: boolean;
  effectDescription: string | null;
  totalPower: number;
  currentHeat: number;
  exploded: boolean;
}

export async function POST(request: NextRequest) {
  try {
    const auth = authenticateRequest(request);
    if (!auth) {
      return NextResponse.json({ error: 'Chưa đăng nhập' }, { status: 401 });
    }

    const { cardIds, questId, crewCardIds } = await request.json();

    // Validate 10 cards
    if (!Array.isArray(cardIds) || cardIds.length !== GAME_CONSTANTS.SLOTS_PER_CAR) {
      return NextResponse.json(
        { error: `Phải xếp đủ ${GAME_CONSTANTS.SLOTS_PER_CAR} thẻ lên khung xe!` },
        { status: 400 }
      );
    }

    // Get quest info
    const quest = await prisma.dailyQuest.findFirst({
      where: { id: questId, userId: auth.userId, status: 'PENDING' },
      include: { bossConfig: true },
    });

    if (!quest) {
      return NextResponse.json(
        { error: 'Quest không hợp lệ hoặc đã hoàn thành' },
        { status: 400 }
      );
    }

    // ============================================================
    // INVENTORY OWNERSHIP CHECK - Kiểm tra user có sở hữu thẻ không
    // ============================================================
    const allCardIds = [...(cardIds as number[])];
    if (crewCardIds && Array.isArray(crewCardIds)) {
      allCardIds.push(...(crewCardIds as number[]));
    }

    const inventory = await prisma.userInventory.findMany({
      where: { userId: auth.userId, cardId: { in: allCardIds } },
    });

    const ownedMap = new Map<number, number>();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    for (const inv of inventory as any[]) {
      ownedMap.set(inv.cardId, inv.quantity);
    }

    // Count card usage (same card can be used multiple times)
    const usageCount = new Map<number, number>();
    for (const cid of allCardIds) {
      usageCount.set(cid, (usageCount.get(cid) || 0) + 1);
    }

    for (const [cid, needed] of usageCount.entries()) {
      const owned = ownedMap.get(cid) || 0;
      if (owned < needed) {
        return NextResponse.json(
          { error: `Không đủ thẻ ID ${cid}! Cần ${needed}, có ${owned}.` },
          { status: 400 }
        );
      }
    }

    // Fetch all cards
    const cards = await prisma.card.findMany({
      where: { id: { in: cardIds as number[] } },
      include: { effects: true },
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const cardMap = new Map<number, any>(cards.map((c: any) => [c.id, c]));

    // ============================================================
    // BOSS SPECIAL CONDITION VALIDATION (PRE-RUN)
    // ============================================================
    if (quest.bossConfig?.specialCondition) {
      const condition = quest.bossConfig.specialCondition;
      const cardTypes = (cardIds as number[]).map((id: number) => cardMap.get(id)?.type);
      const cardRarities = (cardIds as number[]).map((id: number) => cardMap.get(id)?.rarity);

      // NO_EXHAUST: Cấm thẻ EXHAUST
      if (condition === 'NO_EXHAUST' && cardTypes.includes('EXHAUST')) {
        return NextResponse.json(
          { error: `🚫 Boss "${quest.bossConfig.name}" cấm dùng thẻ Ống Xả (EXHAUST)!` },
          { status: 400 }
        );
      }

      // NO_COOLING: Cấm thẻ COOLING
      if (condition === 'NO_COOLING' && cardTypes.includes('COOLING')) {
        return NextResponse.json(
          { error: `🚫 Boss "${quest.bossConfig.name}" cấm dùng thẻ Làm Mát (COOLING)!` },
          { status: 400 }
        );
      }

      // MIN_RARITY_3: Chỉ thẻ ≥ 3 sao
      if (condition === 'MIN_RARITY_3') {
        const lowRarityCard = (cardIds as number[]).find((id: number) => {
          const card = cardMap.get(id);
          return card && card.rarity < 3;
        });
        if (lowRarityCard) {
          const card = cardMap.get(lowRarityCard);
          return NextResponse.json(
            { error: `🚫 Boss "${quest.bossConfig.name}" yêu cầu thẻ ≥ 3 sao! Thẻ "${card?.name}" chỉ ${card?.rarity} sao.` },
            { status: 400 }
          );
        }
      }
    }

    // Fetch combos
    const combos = await prisma.cardCombo.findMany({
      where: {
        OR: [
          { cardId1: { in: cardIds as number[] }, cardId2: { in: cardIds as number[] } },
        ],
      },
    });

    // Fetch crew cards (passive buffs)
    const crewBuffs = { power: 0, heat: 0, stability: 0 };
    if (crewCardIds && Array.isArray(crewCardIds)) {
      const crewCards = await prisma.card.findMany({
        where: { id: { in: crewCardIds as number[] }, type: 'CREW' },
        include: { effects: true },
      });
      for (const crew of crewCards) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        for (const effect of (crew as any).effects) {
          if (effect.triggerCondition === 'PASSIVE') {
            if (effect.targetStat === 'POWER') crewBuffs.power += effect.effectValue;
            if (effect.targetStat === 'HEAT') crewBuffs.heat += effect.effectValue;
            if (effect.targetStat === 'STABILITY') crewBuffs.stability += effect.effectValue;
          }
        }
      }
    }

    // ============================================================
    // SEQUENTIAL TEST RUN - Quét tuần tự từ Slot 1 đến Slot 10
    // ============================================================
    const steps: TestStep[] = [];
    let totalPower = 0;
    let totalStability = 0;
    let currentHeat = 0;
    let exploded = false;

    for (let i = 0; i < cardIds.length; i++) {
      const cardId = cardIds[i] as number;
      const card = cardMap.get(cardId);

      if (!card) {
        return NextResponse.json(
          { error: `Thẻ ID ${cardId} không tồn tại` },
          { status: 400 }
        );
      }

      // Base stats
      let powerAdded = card.statPower;
      let heatAdded = card.statHeat;
      let stabilityReduced = card.statStability;

      // Apply crew buffs
      powerAdded += crewBuffs.power;
      heatAdded = Math.max(0, heatAdded + crewBuffs.heat);
      stabilityReduced += crewBuffs.stability;

      // Check for combos with adjacent card
      let comboTriggered = false;
      let comboEffect: string | null = null;
      let comboValue = 0;

      if (i > 0) {
        const prevCardId = cardIds[i - 1] as number;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const combo = combos.find((c: any) =>
          (c.cardId1 === prevCardId && c.cardId2 === cardId) ||
          (c.cardId1 === cardId && c.cardId2 === prevCardId)
        );
        if (combo) {
          comboTriggered = true;
          comboEffect = combo.effectType;
          comboValue = combo.effectValue;

          if (combo.effectType === 'MULTIPLY_POWER') {
            powerAdded = Math.floor(powerAdded * combo.effectValue);
          } else if (combo.effectType === 'REDUCE_HEAT') {
            heatAdded = Math.floor(heatAdded * combo.effectValue);
          } else if (combo.effectType === 'BONUS_STABILITY') {
            stabilityReduced += combo.effectValue;
          }
        }
      }

      // Check card effects (ON_TEST type)
      let effectTriggered = false;
      let effectDescription: string | null = null;

      for (const effect of card.effects) {
        if (effect.triggerCondition === 'ON_TEST') {
          effectTriggered = true;
          effectDescription = effect.description;

          if (effect.targetStat === 'POWER') {
            if (effect.effectType === 'BUFF') {
              powerAdded += effect.effectValue;
            } else {
              powerAdded -= effect.effectValue;
            }
          } else if (effect.targetStat === 'HEAT') {
            if (effect.effectType === 'DEBUFF') {
              heatAdded += effect.effectValue;
            } else {
              heatAdded -= effect.effectValue;
            }
          } else if (effect.targetStat === 'STABILITY') {
            stabilityReduced += effect.effectValue;
          }
        }
      }

      // Apply stats
      totalPower += powerAdded;
      totalStability += stabilityReduced;
      currentHeat += heatAdded;
      currentHeat = Math.max(0, currentHeat - stabilityReduced);

      // ============================================================
      // BOSS SPECIAL CONDITIONS (DURING RUN)
      // ============================================================
      if (quest.bossConfig?.specialCondition) {
        const cond = quest.bossConfig.specialCondition;
        // MAX_HEAT_50: nhiệt không được quá 50% → penalty nếu quá
        if (cond === 'MAX_HEAT_50' && currentHeat > 50) {
          currentHeat += 20; // Penalty: heat tăng thêm
        }
        // MAX_HEAT_30: nhiệt không được quá 30%
        if (cond === 'MAX_HEAT_30' && currentHeat > 30) {
          currentHeat += 30; // Penalty nặng hơn
        }
      }

      // Check explosion
      if (currentHeat >= GAME_CONSTANTS.HEAT_THRESHOLD) {
        exploded = true;
      }

      steps.push({
        slot: i + 1,
        cardId,
        cardName: card.name,
        cardType: card.type,
        rarity: card.rarity,
        powerAdded,
        heatAdded,
        stabilityReduced,
        comboTriggered,
        comboEffect,
        comboValue,
        effectTriggered,
        effectDescription,
        totalPower,
        currentHeat: Math.round(currentHeat),
        exploded,
      });

      if (exploded) break;
    }

    // ============================================================
    // POST-RUN BOSS CONDITIONS (After all 10 slots)
    // ============================================================
    let conditionFailed = false;
    let conditionMessage = '';

    if (!exploded && quest.bossConfig?.specialCondition) {
      const cond = quest.bossConfig.specialCondition;

      // MIN_HEAT_70: Heat phải trên 70% cuối run
      if (cond === 'MIN_HEAT_70' && currentHeat < 70) {
        conditionFailed = true;
        conditionMessage = `Boss yêu cầu Heat ≥ 70%! Hiện tại: ${Math.round(currentHeat)}%`;
      }

      // MIN_STABILITY_150: Tổng Stability ≥ 150
      if (cond === 'MIN_STABILITY_150' && totalStability < 150) {
        conditionFailed = true;
        conditionMessage = `Boss yêu cầu Stability ≥ 150! Hiện tại: ${totalStability}`;
      }
    }

    // Determine result
    const success = !exploded && !conditionFailed && totalPower >= quest.requiredPower;

    return NextResponse.json({
      message: exploded
        ? `💥 NỔ MÁY tại Slot ${steps.length}! Nhiệt độ vượt ${GAME_CONSTANTS.HEAT_THRESHOLD}%!`
        : conditionFailed
        ? `❌ ĐIỀU KIỆN BOSS THẤT BẠI! ${conditionMessage}`
        : success
        ? `✅ THÀNH CÔNG! Xe đạt ${totalPower} mã lực (yêu cầu: ${quest.requiredPower})`
        : `❌ KHÔNG ĐẠT! Xe chỉ đạt ${totalPower}/${quest.requiredPower} mã lực`,
      result: {
        success,
        exploded,
        conditionFailed,
        conditionMessage: conditionMessage || null,
        totalPower,
        totalStability,
        requiredPower: quest.requiredPower,
        finalHeat: Math.round(currentHeat),
        stepsCompleted: steps.length,
        totalSlots: GAME_CONSTANTS.SLOTS_PER_CAR,
      },
      steps,
      questId: quest.id,
      bossInfo: quest.bossConfig ? {
        name: quest.bossConfig.name,
        specialCondition: quest.bossConfig.specialCondition,
      } : null,
    });

  } catch (error) {
    console.error('Workshop test error:', error);
    return NextResponse.json({ error: 'Lỗi server' }, { status: 500 });
  }
}

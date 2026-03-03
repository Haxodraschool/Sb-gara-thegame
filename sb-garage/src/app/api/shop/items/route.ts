// GET /api/shop/items - Hiển thị shop (random theo drop rate)
// POST /api/shop/buy - Mua thẻ hoặc pack
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { authenticateRequest, GAME_CONSTANTS, rollRarity } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const auth = authenticateRequest(request);
    if (!auth) {
      return NextResponse.json({ error: 'Chưa đăng nhập' }, { status: 401 });
    }

    // Check shop unlock (Ngày 2 trở đi)
    const user = await prisma.user.findUnique({ where: { id: auth.userId } });
    if (!user || user.currentDay < GAME_CONSTANTS.SHOP_UNLOCK_DAY) {
      return NextResponse.json(
        { error: 'Shop chưa mở khóa! Shop mở từ Ngày 2.', shopUnlocked: false },
        { status: 403 }
      );
    }

    // Determine active tax modifier (Đỗ Nam Trung effect)
    let activeTaxModifier = 1.0;
    if (user.currentDay <= user.shopTaxExpiresAt) {
      activeTaxModifier = user.shopTaxModifier;
    }

    // Perk VIP_CARD: Shop giảm giá 20% trong 10 ngày đầu
    if (user.activePerkCode === 'VIP_CARD' && user.currentDay <= 10) {
      activeTaxModifier *= 0.8;
    }

    // Generate shop items (normal cards + packs, NO CREW)
    const shopItems = [];
    for (let i = 0; i < GAME_CONSTANTS.SHOP_ITEMS_COUNT; i++) {
      // 40% chance xuất hiện Pack
      if (Math.random() < GAME_CONSTANTS.PACK_CHANCE_IN_SHOP) {
        // Giá Pack tăng dần theo ngày: Ngày 2 = 350g, Ngày 20+ = 1000g
        const DAY_START = 2;
        const DAY_MAX = 20;
        const PRICE_START = 350;
        const PRICE_MAX = 1000;
        const dayProgress = Math.min(1, (user.currentDay - DAY_START) / (DAY_MAX - DAY_START));
        const basePackPrice = Math.floor(PRICE_START + dayProgress * (PRICE_MAX - PRICE_START));
        shopItems.push({
          slotIndex: i,
          type: 'PACK' as const,
          name: 'Gói Thẻ Bí Ẩn',
          description: `Mở ra nhận ${GAME_CONSTANTS.PACK_CARDS_COUNT} thẻ ngẫu nhiên!${activeTaxModifier !== 1.0 ? ' (Đã áp dụng thuế Đỗ Nam Trung)' : ''}`,
          cost: Math.floor(basePackPrice * activeTaxModifier),
          rarity: null,
          card: null,
        });
      } else {
        // Random card theo drop rate — LOẠI TRỪ CREW
        const rarity = rollRarity();
        const cards = await prisma.card.findMany({
          where: { rarity, type: { not: 'CREW' } },
          include: { effects: true },
        });

        if (cards.length > 0) {
          const randomCard = cards[Math.floor(Math.random() * cards.length)];
          shopItems.push({
            slotIndex: i,
            type: 'CARD' as const,
            name: randomCard.name,
            description: randomCard.description + (activeTaxModifier !== 1.0 ? '\n(Đã áp dụng thuế Đỗ Nam Trung)' : ''),
            cost: Math.floor(randomCard.cost * activeTaxModifier),
            rarity: randomCard.rarity,
            card: {
              id: randomCard.id,
              name: randomCard.name,
              type: randomCard.type,
              rarity: randomCard.rarity,
              statPower: randomCard.statPower,
              statHeat: randomCard.statHeat,
              statStability: randomCard.statStability,
              imageUrl: randomCard.imageUrl,
              effects: randomCard.effects,
            },
          });
        }
      }
    }

    // ============================================================
    // CREW SLOT — 1 slot riêng hiển thị crew chưa sở hữu
    // ============================================================
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const ownedCrewIds = (await prisma.userInventory.findMany({
      where: { userId: auth.userId },
      include: { card: true },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    })).filter((inv: any) => inv.card?.type === 'CREW').map((inv: any) => inv.cardId);

    const unownedCrew = await prisma.card.findMany({
      where: {
        type: 'CREW',
        unlockType: 'SHOP',
        id: { notIn: ownedCrewIds },
      },
      include: { effects: true },
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let crewSlot: any = null;
    if (unownedCrew.length > 0) {
      const randomCrew = unownedCrew[Math.floor(Math.random() * unownedCrew.length)];
      crewSlot = {
        slotIndex: 'crew',
        type: 'CREW' as const,
        name: randomCrew.name,
        description: randomCrew.description,
        cost: Math.floor(randomCrew.cost * activeTaxModifier),
        rarity: randomCrew.rarity,
        card: {
          id: randomCrew.id,
          name: randomCrew.name,
          type: randomCrew.type,
          rarity: randomCrew.rarity,
          statPower: randomCrew.statPower,
          statHeat: randomCrew.statHeat,
          statStability: randomCrew.statStability,
          imageUrl: randomCrew.imageUrl,
          effects: randomCrew.effects,
        },
      };
    }

    return NextResponse.json({
      shopUnlocked: true,
      gold: Number(user.gold),
      items: shopItems,
      crewSlot,
    });

  } catch (error) {
    console.error('Shop items error:', error);
    return NextResponse.json({ error: 'Lỗi server' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = authenticateRequest(request);
    if (!auth) {
      return NextResponse.json({ error: 'Chưa đăng nhập' }, { status: 401 });
    }

    const { cardId, type, cost } = await request.json();

    const user = await prisma.user.findUnique({ where: { id: auth.userId } });
    if (!user) {
      return NextResponse.json({ error: 'Không tìm thấy người chơi' }, { status: 404 });
    }

    if (Number(user.gold) < cost) {
      return NextResponse.json({ error: 'Không đủ vàng!' }, { status: 400 });
    }

    if (type === 'PACK') {
      // Mở pack: nhận 5 thẻ ngẫu nhiên
      const packCards = [];
      for (let i = 0; i < GAME_CONSTANTS.PACK_CARDS_COUNT; i++) {
        const rarity = rollRarity();
        const cards = await prisma.card.findMany({ where: { rarity, type: { not: 'CREW' } } });
        if (cards.length > 0) {
          const randomCard = cards[Math.floor(Math.random() * cards.length)];
          packCards.push(randomCard);
        }
      }

      // Trừ vàng + track shop spending
      await prisma.user.update({
        where: { id: auth.userId },
        data: {
          gold: { decrement: cost },
          totalShopSpent: { increment: cost },
        },
      });

      // Thêm thẻ vào inventory
      for (const card of packCards) {
        await prisma.userInventory.upsert({
          where: { userId_cardId: { userId: auth.userId, cardId: card.id } },
          create: { userId: auth.userId, cardId: card.id, quantity: 1 },
          update: { quantity: { increment: 1 } },
        });
      }

      return NextResponse.json({
        message: 'Mở Pack thành công!',
        cards: packCards.map((c) => ({
          id: c.id,
          name: c.name,
          type: c.type,
          rarity: c.rarity,
          statPower: c.statPower,
          statHeat: c.statHeat,
          statStability: c.statStability,
        })),
        remainingGold: Number(user.gold) - cost,
      });

    } else {
      // Mua thẻ lẻ
      if (!cardId) {
        return NextResponse.json({ error: 'Thiếu cardId' }, { status: 400 });
      }

      await prisma.user.update({
        where: { id: auth.userId },
        data: {
          gold: { decrement: cost },
          totalShopSpent: { increment: cost },
        },
      });

      await prisma.userInventory.upsert({
        where: { userId_cardId: { userId: auth.userId, cardId } },
        create: { userId: auth.userId, cardId, quantity: 1 },
        update: { quantity: { increment: 1 } },
      });

      return NextResponse.json({
        message: 'Mua thẻ thành công!',
        remainingGold: Number(user.gold) - cost,
      });
    }

  } catch (error) {
    console.error('Shop buy error:', error);
    return NextResponse.json({ error: 'Lỗi server' }, { status: 500 });
  }
}

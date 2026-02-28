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

    // Generate shop items
    const shopItems = [];
    for (let i = 0; i < GAME_CONSTANTS.SHOP_ITEMS_COUNT; i++) {
      // 40% chance xuất hiện Pack
      if (Math.random() < GAME_CONSTANTS.PACK_CHANCE_IN_SHOP) {
        shopItems.push({
          slotIndex: i,
          type: 'PACK' as const,
          name: 'Gói Thẻ Bí Ẩn',
          description: `Mở ra nhận ${GAME_CONSTANTS.PACK_CARDS_COUNT} thẻ ngẫu nhiên!`,
          cost: 300,
          rarity: null,
          card: null,
        });
      } else {
        // Random card theo drop rate
        const rarity = rollRarity();
        const cards = await prisma.card.findMany({
          where: { rarity },
          include: { effects: true },
        });

        if (cards.length > 0) {
          const randomCard = cards[Math.floor(Math.random() * cards.length)];
          shopItems.push({
            slotIndex: i,
            type: 'CARD' as const,
            name: randomCard.name,
            description: randomCard.description,
            cost: randomCard.cost,
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

    return NextResponse.json({
      shopUnlocked: true,
      gold: Number(user.gold),
      items: shopItems,
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
        const cards = await prisma.card.findMany({ where: { rarity } });
        if (cards.length > 0) {
          const randomCard = cards[Math.floor(Math.random() * cards.length)];
          packCards.push(randomCard);
        }
      }

      // Trừ vàng
      await prisma.user.update({
        where: { id: auth.userId },
        data: { gold: { decrement: cost } },
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
        data: { gold: { decrement: cost } },
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

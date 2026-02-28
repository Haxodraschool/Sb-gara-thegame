// POST /api/auth/register - Đăng ký tài khoản mới
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { hashPassword, createToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    // Validate input
    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username và password là bắt buộc' },
        { status: 400 }
      );
    }

    if (username.length < 3 || username.length > 50) {
      return NextResponse.json(
        { error: 'Username phải từ 3-50 ký tự' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password phải ít nhất 6 ký tự' },
        { status: 400 }
      );
    }

    // Check existing user
    const existingUser = await prisma.user.findUnique({
      where: { username },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Username đã tồn tại' },
        { status: 409 }
      );
    }

    // Create user with default values
    const hashedPassword = await hashPassword(password);
    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        gold: 500,
        level: 1,
        exp: 0,
        currentDay: 1,
        garageHealth: 100,
        techPoints: 0,
        crewSlots: 1,
        isFinalRound: false,
      },
    });

    // Tặng thẻ mặc định cho người chơi mới (10 thẻ Common)
    const starterCards = await prisma.card.findMany({
      where: { rarity: 1 },
      take: 10,
    });

    if (starterCards.length > 0) {
      await prisma.userInventory.createMany({
        data: starterCards.map((card) => ({
          userId: user.id,
          cardId: card.id,
          quantity: 2,
        })),
      });
    }

    const token = createToken({ userId: user.id, username: user.username });

    return NextResponse.json({
      message: 'Đăng ký thành công! Chào mừng đến SB-GARAGE!',
      token,
      user: {
        id: user.id,
        username: user.username,
        gold: Number(user.gold),
        level: user.level,
        currentDay: user.currentDay,
        garageHealth: user.garageHealth,
        crewSlots: user.crewSlots,
      },
    }, { status: 201 });

  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json(
      { error: 'Lỗi server khi đăng ký' },
      { status: 500 }
    );
  }
}

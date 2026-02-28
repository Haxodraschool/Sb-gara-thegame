// Seed Data - Dữ liệu khởi tạo cho SB-GARAGE
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';

const adapter = new PrismaMariaDb(process.env.DATABASE_URL!);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🚗 Bắt đầu seed dữ liệu SB-GARAGE...\n');

  // ============================================================
  // 1. CARDS - Thẻ bài (30 thẻ)
  // ============================================================
  console.log('📦 Tạo thẻ bài...');

  const cards = await Promise.all([
    // === FILTER (Lọc gió) ===
    prisma.card.create({
      data: { name: 'Lọc Gió Cơ Bản', type: 'FILTER', rarity: 1, statPower: 5, statHeat: 3, statStability: 1, cost: 50, description: 'Bộ lọc gió tiêu chuẩn, giúp không khí sạch vào động cơ.' },
    }),
    prisma.card.create({
      data: { name: 'Lọc Gió Performance', type: 'FILTER', rarity: 2, statPower: 12, statHeat: 5, statStability: 3, cost: 120, description: 'Bộ lọc gió hiệu năng cao, tăng luồng gió đáng kể.' },
    }),
    prisma.card.create({
      data: { name: 'Lọc Gió Carbon Fiber', type: 'FILTER', rarity: 3, statPower: 25, statHeat: 4, statStability: 7, cost: 250, description: 'Lọc gió sợi carbon siêu nhẹ, luồng gió cực mạnh.' },
    }),

    // === ENGINE (Động cơ) ===
    prisma.card.create({
      data: { name: 'Động Cơ 1.5L', type: 'ENGINE', rarity: 1, statPower: 25, statHeat: 12, statStability: 2, cost: 100, description: 'Động cơ 4 xi-lanh 1.5L, đáng tin cậy nhưng công suất thấp.' },
    }),
    prisma.card.create({
      data: { name: 'Động Cơ 2.0L Turbo', type: 'ENGINE', rarity: 2, statPower: 50, statHeat: 20, statStability: 5, cost: 200, description: 'Động cơ 2.0L tăng áp, cân bằng giữa sức mạnh và nhiệt.' },
    }),
    prisma.card.create({
      data: { name: 'V6 Twin-Turbo', type: 'ENGINE', rarity: 3, statPower: 85, statHeat: 30, statStability: 7, cost: 400, description: 'Động cơ V6 đôi tăng áp, sức mạnh vượt trội.' },
    }),
    prisma.card.create({
      data: { name: 'V8 Supercharged', type: 'ENGINE', rarity: 4, statPower: 180, statHeat: 55, statStability: 12, cost: 800, description: 'Quái vật V8 siêu nạp! Công suất khổng lồ nhưng rất nóng.' },
    }),
    prisma.card.create({
      data: { name: 'W16 Quad-Turbo', type: 'ENGINE', rarity: 5, statPower: 250, statHeat: 45, statStability: 20, cost: 2000, description: 'Động cơ W16 huyền thoại - đỉnh cao kỹ thuật cơ khí. Hiệu ứng đặc biệt!' },
    }),

    // === TURBO ===
    prisma.card.create({
      data: { name: 'Turbo Nhỏ', type: 'TURBO', rarity: 1, statPower: 12, statHeat: 10, statStability: 1, cost: 80, description: 'Turbo nhỏ tăng áp nhẹ cho động cơ.' },
    }),
    prisma.card.create({
      data: { name: 'Turbo Tăng Áp Đôi', type: 'TURBO', rarity: 3, statPower: 42, statHeat: 18, statStability: 3, cost: 350, description: 'Hệ thống tăng áp kép, boost mạnh mẽ!' },
    }),
    prisma.card.create({
      data: { name: 'Turbo Titan X', type: 'TURBO', rarity: 5, statPower: 100, statHeat: 20, statStability: 15, cost: 1500, description: 'Turbo cấp huyền thoại! Combo cùng Lọc Gió = nhân đôi Power.' },
    }),

    // === EXHAUST (Ống xả) ===
    prisma.card.create({
      data: { name: 'Ống Xả Tiêu Chuẩn', type: 'EXHAUST', rarity: 1, statPower: 8, statHeat: -3, statStability: 4, cost: 60, description: 'Ống xả mặc định, thoát khí ổn định.' },
    }),
    prisma.card.create({
      data: { name: 'Ống Xả Performance', type: 'EXHAUST', rarity: 2, statPower: 18, statHeat: -6, statStability: 7, cost: 150, description: 'Ống xả thể thao, thoát khí nhanh giảm nhiệt.' },
    }),
    prisma.card.create({
      data: { name: 'Ống Xả Titan Racing', type: 'EXHAUST', rarity: 4, statPower: 50, statHeat: -20, statStability: 18, cost: 600, description: 'Ống xả titanium racing! Giảm nhiệt mạnh + tăng power.' },
    }),

    // === COOLING (Hệ thống làm mát) ===
    prisma.card.create({
      data: { name: 'Quạt Làm Mát', type: 'COOLING', rarity: 1, statPower: 0, statHeat: -5, statStability: 8, cost: 70, description: 'Quạt tản nhiệt cơ bản, giúp hạ nhiệt động cơ.' },
    }),
    prisma.card.create({
      data: { name: 'Két Nước Racing', type: 'COOLING', rarity: 2, statPower: 3, statHeat: -9, statStability: 12, cost: 160, description: 'Két nước cỡ lớn cho xe đua, làm mát hiệu quả.' },
    }),
    prisma.card.create({
      data: { name: 'Intercooler Carbon', type: 'COOLING', rarity: 3, statPower: 7, statHeat: -18, statStability: 18, cost: 380, description: 'Bộ tản nhiệt trung gian carbon, giảm nhiệt cực mạnh.' },
    }),
    prisma.card.create({
      data: { name: 'Cryo Cooling System', type: 'COOLING', rarity: 5, statPower: 15, statHeat: -35, statStability: 35, cost: 1800, description: 'Hệ thống làm mát đông lạnh! Đóng băng mọi nhiệt độ.' },
    }),

    // === FUEL (Nhiên liệu) ===
    prisma.card.create({
      data: { name: 'Xăng RON 95', type: 'FUEL', rarity: 1, statPower: 10, statHeat: 6, statStability: 2, cost: 50, description: 'Nhiên liệu tiêu chuẩn.' },
    }),
    prisma.card.create({
      data: { name: 'Xăng Racing 100', type: 'FUEL', rarity: 3, statPower: 32, statHeat: 10, statStability: 5, cost: 300, description: 'Xăng cao cấp cho xe đua, cháy sạch hơn.' },
    }),
    prisma.card.create({
      data: { name: 'Nhiên Liệu Tên Lửa', type: 'FUEL', rarity: 4, statPower: 70, statHeat: 30, statStability: 5, cost: 700, description: 'Nhiên liệu quân sự! Sức mạnh khủng khiếp nhưng rất nguy hiểm.' },
    }),

    // === SUSPENSION (Hệ thống treo) ===
    prisma.card.create({
      data: { name: 'Giảm Xóc Cơ Bản', type: 'SUSPENSION', rarity: 1, statPower: 2, statHeat: 0, statStability: 6, cost: 60, description: 'Giảm xóc tiêu chuẩn, giữ xe ổn định.' },
    }),
    prisma.card.create({
      data: { name: 'Coilover Racing', type: 'SUSPENSION', rarity: 3, statPower: 10, statHeat: 0, statStability: 15, cost: 350, description: 'Hệ thống treo có thể chỉnh độ cao và độ cứng.' },
    }),

    // === NITROUS (NOS) ===
    prisma.card.create({
      data: { name: 'NOS Nhỏ', type: 'NITROUS', rarity: 2, statPower: 25, statHeat: 18, statStability: 0, cost: 180, description: 'Bình NOS nhỏ, tăng sức mạnh tức thì!' },
    }),
    prisma.card.create({
      data: { name: 'NOS Mega', type: 'NITROUS', rarity: 4, statPower: 80, statHeat: 40, statStability: 0, cost: 650, description: 'Bình NOS cỡ lớn! Bùng nổ sức mạnh nhưng cực kỳ nguy hiểm.' },
    }),

    // === TOOL (Công cụ) ===
    prisma.card.create({
      data: { name: 'Bộ Cờ Lê', type: 'TOOL', rarity: 1, statPower: 2, statHeat: 0, statStability: 5, cost: 40, description: 'Bộ cờ lê cơ bản, giúp lắp ráp chắc chắn hơn.' },
    }),
    prisma.card.create({
      data: { name: 'Máy Chẩn Đoán OBD2', type: 'TOOL', rarity: 2, statPower: 6, statHeat: -3, statStability: 9, cost: 130, description: 'Máy quét lỗi xe, giúp phát hiện vấn đề sớm.' },
    }),

    // === TIRE (Lốp xe) ===
    prisma.card.create({
      data: { name: 'Lốp Đường Phố', type: 'TIRE', rarity: 1, statPower: 3, statHeat: 0, statStability: 8, cost: 55, description: 'Lốp tiêu chuẩn, bám đường ổn định trên mặt nhựa.' },
    }),
    prisma.card.create({
      data: { name: 'Lốp Semi-Slick', type: 'TIRE', rarity: 2, statPower: 8, statHeat: 2, statStability: 16, cost: 180, description: 'Lốp bán chuyên, độ bám tốt trên mặt khô.' },
    }),
    prisma.card.create({
      data: { name: 'Lốp Racing Slick', type: 'TIRE', rarity: 4, statPower: 25, statHeat: 5, statStability: 35, cost: 650, description: 'Lốp đua chuyên nghiệp! Bám cực tốt nhưng nóng nhẹ khi ma sát cao.' },
    }),

    // === CREW: 6 Normal (Mở khóa thông thường) ===
    prisma.card.create({
      data: { name: 'Kỹ Sư Nhiệt (The Cooler)', type: 'CREW', rarity: 2, statPower: 0, statHeat: 0, statStability: 0, cost: 150, unlockType: 'SHOP', description: '"Giải nhiệt cấp tốc": Giảm 10% Nhiệt độ tổng cho mọi Turbo được lắp.' },
    }),
    prisma.card.create({
      data: { name: 'Chuyên Gia Ống Xả (The Flow)', type: 'CREW', rarity: 3, statPower: 0, statHeat: 0, statStability: 0, cost: 350, unlockType: 'QUEST', description: '"Luồng khí mượt mà": Thẻ Ống xả +15 Power, không tăng thêm Heat.' },
    }),
    prisma.card.create({
      data: { name: 'Tay Lái Thử (The Stuntman)', type: 'CREW', rarity: 3, statPower: 0, statHeat: 0, statStability: 0, cost: 400, unlockType: 'QUEST', description: '"Kiểm soát giới hạn": Khi Heat đạt 95%, thời gian đếm ngược nổ máy chậm lại 2 giây.' },
    }),
    prisma.card.create({
      data: { name: 'Kế Toán Trưởng (The Accountant)', type: 'CREW', rarity: 2, statPower: 0, statHeat: 0, statStability: 0, cost: 250, unlockType: 'QUEST', description: '"Tối ưu ngân sách": Hoàn trả 10% tiền mua linh kiện sau mỗi màn thắng.' },
    }),
    prisma.card.create({
      data: { name: 'Thợ Sơn (The Artist)', type: 'CREW', rarity: 2, statPower: 0, statHeat: 0, statStability: 0, cost: 200, unlockType: 'QUEST', description: '"Vẻ ngoài hào nhoáng": +15% sự hài lòng khách, nhận thêm tiền tip ngẫu nhiên.' },
    }),
    prisma.card.create({
      data: { name: 'Chuyên Gia Lốp (The Grip)', type: 'CREW', rarity: 3, statPower: 0, statHeat: 0, statStability: 0, cost: 450, unlockType: 'QUEST', description: '"Bám đường tuyệt đối": +20 Stability cho xe có động cơ trên 400 mã lực.' },
    }),

    // === CREW: 5 Hidden (Cần Achievement) ===
    prisma.card.create({
      data: { name: 'Kẻ Đào Tẩu (The Fugitive)', type: 'CREW', rarity: 4, statPower: 0, statHeat: 0, statStability: 0, cost: 0, unlockType: 'ACHIEVEMENT', description: '"Chạy trốn": Bỏ qua mọi yêu cầu khắt khe của Boss.' },
    }),
    prisma.card.create({
      data: { name: 'Linh Hồn Gara (Ghost Mechanic)', type: 'CREW', rarity: 5, statPower: 0, statHeat: 0, statStability: 0, cost: 0, unlockType: 'ACHIEVEMENT', description: '"Hồi sinh": 1 lần/màn, cứu xe khi nổ máy. Xe hoàn thành với 1 HP.' },
    }),
    prisma.card.create({
      data: { name: 'Chủ Tịch Tập Đoàn (The CEO)', type: 'CREW', rarity: 4, statPower: 0, statHeat: 0, statStability: 0, cost: 0, unlockType: 'ACHIEVEMENT', description: '"Đầu tư mạo hiểm": Mượn 1 linh kiện Legendary (5 sao) dùng thử 1 màn.' },
    }),
    prisma.card.create({
      data: { name: 'Hacker Mũ Đen (Black-Hat)', type: 'CREW', rarity: 5, statPower: 0, statHeat: 0, statStability: 0, cost: 0, unlockType: 'ACHIEVEMENT', description: '"Chỉnh sửa mã nguồn": Đổi vị trí 2 lá bài ngay khi xe đang chạy thử.' },
    }),
    prisma.card.create({
      data: { name: 'Huyền Thoại Giải Nghệ (The Legend)', type: 'CREW', rarity: 5, statPower: 0, statHeat: 0, statStability: 0, cost: 0, unlockType: 'ACHIEVEMENT', description: '"Bàn tay vàng": Common/Uncommon tự động nâng chỉ số lên ngang Rare.' },
    }),
  ]);

  console.log(`✅ Đã tạo ${cards.length} thẻ bài\n`);

  // ============================================================
  // 2. CARD EFFECTS (Hiệu ứng đặc biệt cho thẻ 4-5 sao)
  // ============================================================
  console.log('✨ Tạo hiệu ứng thẻ...');

  await Promise.all([
    // V8 Supercharged (rarity 4)
    prisma.cardEffect.create({
      data: { cardId: cards[7].id, effectType: 'BUFF', triggerCondition: 'ON_TEST', targetStat: 'POWER', effectValue: 30, description: 'V8 Rage: +30 Power khi chạy thử.' },
    }),
    // W16 Quad-Turbo (rarity 5)
    prisma.cardEffect.create({
      data: { cardId: cards[8].id, effectType: 'BUFF', triggerCondition: 'ON_TEST', targetStat: 'POWER', effectValue: 50, description: 'W16 Ultimate: +50 Power cực đại!' },
    }),
    prisma.cardEffect.create({
      data: { cardId: cards[8].id, effectType: 'BUFF', triggerCondition: 'PASSIVE', targetStat: 'STABILITY', effectValue: 10, description: 'Kỹ thuật hoàn hảo: +10 Stability.' },
    }),
    // Turbo Titan X (rarity 5)
    prisma.cardEffect.create({
      data: { cardId: cards[11].id, effectType: 'BUFF', triggerCondition: 'ADJACENT', targetStat: 'POWER', effectValue: 2.0, description: 'Titan Boost: x2 Power khi cạnh Lọc Gió!' },
    }),
    // Ống Xả Titan Racing (rarity 4)
    prisma.cardEffect.create({
      data: { cardId: cards[14].id, effectType: 'BUFF', triggerCondition: 'ON_TEST', targetStat: 'HEAT', effectValue: -15, description: 'Titan Exhaust: Giảm thêm 15 Heat.' },
    }),
    // Cryo Cooling System (rarity 5)
    prisma.cardEffect.create({
      data: { cardId: cards[18].id, effectType: 'BUFF', triggerCondition: 'PASSIVE', targetStat: 'HEAT', effectValue: -10, description: 'Cryo Freeze: Giảm 10 Heat cho toàn bộ xe.' },
    }),
    // Nhiên Liệu Tên Lửa (rarity 4)
    prisma.cardEffect.create({
      data: { cardId: cards[21].id, effectType: 'DEBUFF', triggerCondition: 'ON_TEST', targetStat: 'HEAT', effectValue: 20, description: 'Rocket Burn: +20 Heat nguy hiểm!' },
    }),
    // NOS Mega (rarity 4)
    prisma.cardEffect.create({
      data: { cardId: cards[25].id, effectType: 'BUFF', triggerCondition: 'ON_TEST', targetStat: 'POWER', effectValue: 40, description: 'Mega Blast: +40 Power bùng nổ!' },
    }),
    // === TIRE EFFECTS ===
    // Lốp Racing Slick (rarity 4) - index 29
    prisma.cardEffect.create({
      data: { cardId: cards[29].id, effectType: 'BUFF', triggerCondition: 'ON_TEST', targetStat: 'STABILITY', effectValue: 15, description: 'Grip Tuyệt Đối: +15 Stability khi chạy thử.' },
    }),
    // === CREW EFFECTS (11 Crew Members) ===
    // Normal Crew Effects
    // index 30: The Cooler - Giảm 10% Heat cho Turbo
    prisma.cardEffect.create({
      data: { cardId: cards[30].id, effectType: 'BUFF', triggerCondition: 'PASSIVE', targetStat: 'HEAT', effectValue: -10, description: 'Giải nhiệt cấp tốc: Giảm 10% Heat cho mọi Turbo.' },
    }),
    // index 31: The Flow - Ống xả +15 Power
    prisma.cardEffect.create({
      data: { cardId: cards[31].id, effectType: 'BUFF', triggerCondition: 'PASSIVE', targetStat: 'POWER', effectValue: 15, description: 'Luồng khí mượt mà: Ống xả +15 Power, 0 Heat thêm.' },
    }),
    // index 32: The Stuntman - Chậm nổ 2s (handled by frontend flag)
    prisma.cardEffect.create({
      data: { cardId: cards[32].id, effectType: 'UTILITY', triggerCondition: 'PASSIVE', targetStat: 'HEAT', effectValue: 5, description: 'Kiểm soát giới hạn: Ngưỡng nổ +5% khi Heat > 95%.' },
    }),
    // index 33: The Accountant - Hoàn 10% gold
    prisma.cardEffect.create({
      data: { cardId: cards[33].id, effectType: 'UTILITY', triggerCondition: 'PASSIVE', targetStat: 'GOLD', effectValue: 10, description: 'Tối ưu ngân sách: Hoàn trả 10% tiền mua linh kiện.' },
    }),
    // index 34: The Artist - +15% gold tip
    prisma.cardEffect.create({
      data: { cardId: cards[34].id, effectType: 'UTILITY', triggerCondition: 'PASSIVE', targetStat: 'GOLD', effectValue: 15, description: 'Vẻ ngoài hào nhoáng: +15% tiền tip ngẫu nhiên.' },
    }),
    // index 35: The Grip - +20 Stability nếu Power > 400
    prisma.cardEffect.create({
      data: { cardId: cards[35].id, effectType: 'BUFF', triggerCondition: 'PASSIVE', targetStat: 'STABILITY', effectValue: 20, description: 'Bám đường tuyệt đối: +20 Stability cho xe > 400 HP.' },
    }),
    // Hidden Crew Effects
    // index 36: The Fugitive - Bypass Boss conditions
    prisma.cardEffect.create({
      data: { cardId: cards[36].id, effectType: 'UTILITY', triggerCondition: 'PASSIVE', targetStat: 'POWER', effectValue: 0, description: 'Chạy trốn: Bypass mọi điều kiện Boss.' },
    }),
    // index 37: Ghost Mechanic - 1x cứu nổ
    prisma.cardEffect.create({
      data: { cardId: cards[37].id, effectType: 'UTILITY', triggerCondition: 'PASSIVE', targetStat: 'HEAT', effectValue: 0, description: 'Hồi sinh: 1 lần/màn cứu xe khi nổ máy.' },
    }),
    // index 38: The CEO - Mượn 1 Legendary
    prisma.cardEffect.create({
      data: { cardId: cards[38].id, effectType: 'UTILITY', triggerCondition: 'PASSIVE', targetStat: 'POWER', effectValue: 0, description: 'Đầu tư mạo hiểm: Mượn 1 Legendary miễn phí.' },
    }),
    // index 39: Black-Hat - Swap 2 cards mid-test (frontend flag)
    prisma.cardEffect.create({
      data: { cardId: cards[39].id, effectType: 'UTILITY', triggerCondition: 'PASSIVE', targetStat: 'POWER', effectValue: 0, description: 'Chỉnh sửa mã nguồn: Đổi vị trí 2 thẻ khi đang test.' },
    }),
    // index 40: The Legend - Common/Uncommon → Rare stats
    prisma.cardEffect.create({
      data: { cardId: cards[40].id, effectType: 'BUFF', triggerCondition: 'PASSIVE', targetStat: 'POWER', effectValue: 0, description: 'Bàn tay vàng: Common/Uncommon nâng chỉ số thành Rare.' },
    }),
  ]);

  console.log('✅ Đã tạo hiệu ứng thẻ\n');

  // ============================================================
  // 3. CARD COMBOS (Phản ứng dây chuyền - 25 combo sáng tạo)
  // ============================================================
  console.log('🔗 Tạo combos...');

  await Promise.all([
    // ========== COMBO LINH KIỆN ==========

    // 1. Lọc Gió Performance + Động Cơ 2.0L Turbo
    prisma.cardCombo.create({
      data: { cardId1: cards[1].id, cardId2: cards[4].id, effectType: 'BONUS_POWER', effectValue: 20, name: '⚡ Tăng Áp Hiệu Quả', description: 'Turbo hút gió sạch từ bộ lọc Performance, +20 Power mà không tăng Heat từ turbo.' },
    }),
    // 2. Turbo Tăng Áp Đôi + Ống Xả Titan Racing
    prisma.cardCombo.create({
      data: { cardId1: cards[9].id, cardId2: cards[13].id, effectType: 'POWER_TO_STABILITY', effectValue: 0.05, name: '💨 Thoát Khí Tự Do', description: 'Mỗi 100 Power tạo ra sẽ tự động cộng thêm 5 Stability - áp suất khí xả được giải phóng hoàn hảo.' },
    }),
    // 3. Lọc Gió Carbon Fiber + Turbo Titan X
    prisma.cardCombo.create({
      data: { cardId1: cards[2].id, cardId2: cards[10].id, effectType: 'MULTIPLY_POWER', effectValue: 2.5, name: '🌪️ Cơn Lốc Carbon', description: 'Sợi carbon siêu nhẹ + turbo huyền thoại tạo cơn lốc không khí, x2.5 Power turbo!' },
    }),
    // 4. V8 Supercharged + Cryo Cooling System
    prisma.cardCombo.create({
      data: { cardId1: cards[6].id, cardId2: cards[17].id, effectType: 'NEGATE_HEAT', effectValue: 1.0, name: '❄️ Quái Thú Băng Giá', description: 'Cryo đóng băng hoàn toàn V8! Xóa toàn bộ Heat của V8 Supercharged.' },
    }),
    // 5. W16 Quad-Turbo + Nhiên Liệu Tên Lửa
    prisma.cardCombo.create({
      data: { cardId1: cards[7].id, cardId2: cards[20].id, effectType: 'MULTIPLY_POWER', effectValue: 3.0, name: '🚀 Ngày Tận Thế', description: 'W16 + Nhiên liệu Tên Lửa = sức mạnh x3! Nhưng Heat cũng tăng x1.5 - cẩn thận!' },
    }),
    // 6. V6 Twin-Turbo + Xăng Racing 100
    prisma.cardCombo.create({
      data: { cardId1: cards[5].id, cardId2: cards[19].id, effectType: 'REDUCE_HEAT', effectValue: 0.6, name: '🔥 Cháy Sạch Hoàn Hảo', description: 'Xăng Racing cao cấp + V6 = cháy sạch hoàn toàn, giảm 40% Heat từ engine.' },
    }),
    // 7. NOS Mega + Ống Xả Performance
    prisma.cardCombo.create({
      data: { cardId1: cards[24].id, cardId2: cards[12].id, effectType: 'BONUS_POWER', effectValue: 35, name: '💥 Sóng Xung Kích', description: 'NOS phun ngược qua ống xả tạo sóng xung kích cực mạnh, +35 Power bùng nổ!' },
    }),
    // 8. NOS Nhỏ + Xăng RON 95
    prisma.cardCombo.create({
      data: { cardId1: cards[23].id, cardId2: cards[18].id, effectType: 'BONUS_POWER', effectValue: 15, name: '🎆 Pháo Hoa Đường Phố', description: 'NOS nhỏ + RON 95 tạo hiệu ứng pháo hoa ngoạn mục, +15 Power thêm.' },
    }),
    // 9. Intercooler Carbon + Turbo Nhỏ
    prisma.cardCombo.create({
      data: { cardId1: cards[16].id, cardId2: cards[8].id, effectType: 'REDUCE_HEAT', effectValue: 0.3, name: '🧊 Turbo Lạnh', description: 'Intercooler carbon giữ turbo mát lạnh, giảm 70% Heat từ turbo nhỏ.' },
    }),
    // 10. Két Nước Racing + Động Cơ 1.5L
    prisma.cardCombo.create({
      data: { cardId1: cards[15].id, cardId2: cards[3].id, effectType: 'BONUS_STABILITY', effectValue: 12, name: '🌊 Dòng Chảy Hoàn Hảo', description: 'Két nước cỡ lớn + động cơ nhỏ gọn = hệ thống làm mát hoàn hảo, +12 Stability.' },
    }),
    // 11. Coilover Racing + Lốp Racing Slick
    prisma.cardCombo.create({
      data: { cardId1: cards[22].id, cardId2: cards[29].id, effectType: 'MULTIPLY_STABILITY', effectValue: 1.5, name: '🏎️ Bám Đường Tuyệt Đối', description: 'Hệ thống treo racing + lốp slick chuyên nghiệp = x1.5 tổng Stability.' },
    }),
    // 12. Giảm Xóc Cơ Bản + Lốp Semi-Slick
    prisma.cardCombo.create({
      data: { cardId1: cards[21].id, cardId2: cards[28].id, effectType: 'BONUS_STABILITY', effectValue: 10, name: '🛞 Cân Bằng Đường Phố', description: 'Setup đường phố cân bằng và đáng tin cậy, +10 Stability.' },
    }),
    // 13. Máy Chẩn Đoán OBD2 + V8 Supercharged
    prisma.cardCombo.create({
      data: { cardId1: cards[26].id, cardId2: cards[6].id, effectType: 'REDUCE_HEAT', effectValue: 0.7, name: '🔧 Tinh Chỉnh Quái Thú', description: 'OBD2 tối ưu thông số V8, giảm 30% Heat nhờ chạy đúng hiệu suất tối ưu.' },
    }),
    // 14. Bộ Cờ Lê + Quạt Làm Mát
    prisma.cardCombo.create({
      data: { cardId1: cards[25].id, cardId2: cards[14].id, effectType: 'BONUS_STABILITY', effectValue: 8, name: '🛠️ Thợ Máy Chăm Chỉ', description: 'Lắp ráp cẩn thận với cờ lê + quạt mát chạy ổn định = +8 Stability.' },
    }),
    // 15. Nhiên Liệu Tên Lửa + NOS Mega
    prisma.cardCombo.create({
      data: { cardId1: cards[20].id, cardId2: cards[24].id, effectType: 'MULTIPLY_POWER', effectValue: 2.0, name: '☠️ Canh Bạc Tử Thần', description: 'ALL IN! x2 Power tổng nhưng Heat cũng x2 - chỉ dành cho kẻ liều mạng!' },
    }),
    // 16. Lốp Đường Phố + Quạt Làm Mát
    prisma.cardCombo.create({
      data: { cardId1: cards[27].id, cardId2: cards[14].id, effectType: 'BONUS_STABILITY', effectValue: 15, name: '🌆 Xe Hàng Ngày Tin Cậy', description: 'Setup daily-driver hoàn hảo cho xe hàng ngày, +15 Stability.' },
    }),

    // ========== COMBO CREW ==========

    // 17. Kỹ Sư Nhiệt + Intercooler Carbon
    prisma.cardCombo.create({
      data: { cardId1: cards[30].id, cardId2: cards[16].id, effectType: 'REDUCE_HEAT', effectValue: 0.5, name: '🧪 Phòng Thí Nghiệm Lạnh', description: 'Kỹ sư nhiệt vận hành Intercooler ở hiệu suất tối đa, giảm 50% tổng Heat!' },
    }),
    // 18. Chuyên Gia Ống Xả + Ống Xả Titan Racing
    prisma.cardCombo.create({
      data: { cardId1: cards[31].id, cardId2: cards[13].id, effectType: 'BONUS_POWER', effectValue: 30, name: '🎵 Bản Giao Hưởng Titan', description: 'Chuyên gia tinh chỉnh ống xả Titan đạt âm thanh hoàn hảo, +30 Power.' },
    }),
    // 19. Tay Lái Thử + NOS Mega
    prisma.cardCombo.create({
      data: { cardId1: cards[32].id, cardId2: cards[24].id, effectType: 'REDUCE_HEAT', effectValue: 0.8, name: '🎯 Drift Tử Thần', description: 'Tay lái kiểm soát NOS bằng kỹ năng drift, giảm 20% Heat từ NOS.' },
    }),
    // 20. Kế Toán Trưởng + Bộ Cờ Lê
    prisma.cardCombo.create({
      data: { cardId1: cards[33].id, cardId2: cards[25].id, effectType: 'BONUS_GOLD', effectValue: 20, name: '💰 Tiết Kiệm Là Làm Giàu', description: 'Kế toán tối ưu chi phí công cụ, +20% Gold thưởng mỗi màn thắng.' },
    }),
    // 21. Chuyên Gia Lốp + Lốp Racing Slick
    prisma.cardCombo.create({
      data: { cardId1: cards[35].id, cardId2: cards[29].id, effectType: 'MULTIPLY_STABILITY', effectValue: 2.0, name: '🏆 Vua Đường Đua', description: 'Chuyên gia lốp + slick chuyên nghiệp = x2 Stability từ lốp!' },
    }),
    // 22. Huyền Thoại Giải Nghệ + W16 Quad-Turbo
    prisma.cardCombo.create({
      data: { cardId1: cards[40].id, cardId2: cards[7].id, effectType: 'MULTIPLY_POWER', effectValue: 1.5, name: '👑 Bàn Tay Vàng W16', description: 'Huyền thoại chạm vào W16, mọi stat của W16 được nhân x1.5!' },
    }),
    // 23. Ghost Mechanic + Cryo Cooling System
    prisma.cardCombo.create({
      data: { cardId1: cards[37].id, cardId2: cards[17].id, effectType: 'NEGATE_HEAT', effectValue: 0.5, name: '👻 Linh Hồn Đông Lạnh', description: 'Linh hồn gara + Cryo = xóa 50% tổng Heat toàn bộ xe.' },
    }),
    // 24. Hacker Mũ Đen + Máy Chẩn Đoán OBD2
    prisma.cardCombo.create({
      data: { cardId1: cards[39].id, cardId2: cards[26].id, effectType: 'BONUS_POWER', effectValue: 25, name: '💻 Hack Hệ Thống', description: 'Hack OBD2 → overclock toàn bộ hệ thống xe, +25 Power.' },
    }),
    // 25. Thợ Sơn + Lốp Semi-Slick
    prisma.cardCombo.create({
      data: { cardId1: cards[34].id, cardId2: cards[28].id, effectType: 'BONUS_GOLD', effectValue: 15, name: '🎨 Show Car', description: 'Xe đẹp + lốp đẹp = khách hàng mê mẩn, +15% Gold thêm.' },
    }),
  ]);

  console.log('✅ Đã tạo 25 combos\n');

  // ============================================================
  // 4. BOSS CONFIGS (10+ Bosses)
  // ============================================================
  console.log('👹 Tạo Boss configs...');

  await Promise.all([
    prisma.bossConfig.create({
      data: { name: 'Ông Hoàng Drift', description: '"Xe phải mạnh, nhưng tao cấm ống xả ồn ào!"', specialCondition: 'NO_EXHAUST', requiredPower: 400, rewardGold: 800 },
    }),
    prisma.bossConfig.create({
      data: { name: 'Bà Chủ Tập Đoàn', description: '"Xe phải chạy mượt, nhiệt không quá 50%!"', specialCondition: 'MAX_HEAT_50', requiredPower: 350, rewardGold: 1000 },
    }),
    prisma.bossConfig.create({
      data: { name: 'Tay Đua Ngầm', description: '"Tao cần tốc độ, 500 mã lực trở lên!"', specialCondition: null, requiredPower: 500, rewardGold: 1200 },
    }),
    prisma.bossConfig.create({
      data: { name: 'Nhà Sưu Tập', description: '"Chỉ dùng thẻ 3 sao trở lên thôi nhé!"', specialCondition: 'MIN_RARITY_3', requiredPower: 450, rewardGold: 1500 },
    }),
    prisma.bossConfig.create({
      data: { name: 'Kẻ Phá Hoại', description: '"Lắp cho tao chiếc xe dễ nổ nhất có thể!"', specialCondition: null, requiredPower: 600, rewardGold: 2000 },
    }),
    prisma.bossConfig.create({
      data: { name: 'Cô Gái Liều Lĩnh', description: '"Thích nguy hiểm! Heat phải trên 70% mà không nổ!"', specialCondition: 'MIN_HEAT_70', requiredPower: 400, rewardGold: 1800 },
    }),
    prisma.bossConfig.create({
      data: { name: 'Ông Trùm Mafia', description: '"Tao cần xe bất khả chiến bại. 700 mã lực."', specialCondition: null, requiredPower: 700, rewardGold: 3000 },
    }),
    prisma.bossConfig.create({
      data: { name: 'Vua Sa Mạc', description: '"Xe phải chịu nhiệt tốt. Stability ít nhất 150!"', specialCondition: 'MIN_STABILITY_150', requiredPower: 500, rewardGold: 2500 },
    }),
    prisma.bossConfig.create({
      data: { name: 'Huyền Thoại F1', description: '"Chỉ có thể dùng Engine và Turbo. No Cooling!"', specialCondition: 'NO_COOLING', requiredPower: 550, rewardGold: 2200 },
    }),
    prisma.bossConfig.create({
      data: { name: 'Kẻ Bí Ẩn', description: '"..."', specialCondition: null, requiredPower: 800, rewardGold: 5000 },
    }),
    prisma.bossConfig.create({
      data: { name: 'Thần Tốc Độ', description: '"Phá vỡ mọi giới hạn! 900 mã lực!"', specialCondition: null, requiredPower: 900, rewardGold: 8000 },
    }),
    prisma.bossConfig.create({
      data: { name: 'Hoàng Đế Cơ Khí', description: '"Ta đã chờ đợi một người xứng đáng..."', specialCondition: 'MAX_HEAT_30', requiredPower: 750, rewardGold: 10000 },
    }),
  ]);

  console.log('✅ Đã tạo 12 Boss configs\n');

  // ============================================================
  // 5. GAME EVENTS (Sự kiện ngẫu nhiên)
  // ============================================================
  console.log('⚡ Tạo game events...');

  await Promise.all([
    prisma.gameEvent.create({
      data: { name: 'Tay Buôn Lậu Gõ Cửa', description: 'Một gã bí ẩn xuất hiện! Chấp nhận: Mua linh kiện hiếm giá rẻ (-5 uy tín/món), bán thẻ lấy gold (50% giá). Đổi lại: -10 uy tín và bị trừ 15% tiền thưởng ngày tiếp theo.', type: 'CHOICE', targetAttribute: 'GARAGE_HEALTH', effectValue: -10, probability: 0.3 },
    }),
    prisma.gameEvent.create({
      data: { name: 'Ánh Trăng Racing', description: 'Tổ đội đua xe ngầm thách thức bạn! Chấp nhận: Trừ 15 Uy tín để đua, nhưng nhận về 800 Gold tiền cược.', type: 'CHOICE', targetAttribute: 'GOLD', effectValue: 800, probability: 0.15 },
    }),
    prisma.gameEvent.create({
      data: { name: 'Băng Đảng Xăng Dầu', description: 'Băng đảng thao túng giá nguyên liệu! Gara bị ép đóng "phí bảo kê" mất 15% tổng số Gold hiện có.', type: 'PASSIVE', targetAttribute: 'GOLD_PERCENTAGE', effectValue: -0.15, probability: 0.2 },
    }),
    prisma.gameEvent.create({
      data: { name: 'Độ Channel Bốc Phốt', description: 'Kênh Youtube triệu view bất ngờ live-stream xưởng của bạn. Uy tín tăng vọt (+40), nhưng bạn phải cắn răng chi 200 Gold "phí bôi trơn PR".', type: 'PASSIVE', targetAttribute: 'GARAGE_HEALTH', effectValue: 40, probability: 0.1 },
    }),
    prisma.gameEvent.create({
      data: { name: 'Đấu Giá Kho Xưởng', description: 'Ngân hàng thanh lý kho JDM cũ. Chấp nhận: Cược 300 Gold mua mù. Đổi lại bạn nhận được lượng lớn kinh nghiệm (500 Tech Points) từ đồ phế liệu!', type: 'CHOICE', targetAttribute: 'TECH_POINTS', effectValue: 500, probability: 0.15 },
    }),
    prisma.gameEvent.create({
      data: { name: 'Kẻ Chế Tạo Cuồng Tín', description: 'Một kỹ sư điên rồ đưa bản thiết kế cấm kỵ. Chấp nhận: Nhận 400 Tech Points thăng cấp thần tốc, đổi lại Gara mang tiếng nguy hiểm (-20 Uy Tín).', type: 'CHOICE', targetAttribute: 'TECH_POINTS', effectValue: 400, probability: 0.1 },
    }),
    prisma.gameEvent.create({
      data: { name: 'Cảnh Sát Đột Kích', description: 'Cơ động xét hỏi xưởng chui! Bạn mất 150 Gold tiền phạt ngầm và bị bêu rếu trên báo (-10 Uy Tín).', type: 'PASSIVE', targetAttribute: 'GARAGE_HEALTH', effectValue: -10, probability: 0.15 },
    }),
  ]);

  console.log('✅ Đã tạo 7 game events\n');

  // ============================================================
  // 6. ENDINGS (Đa kết cục)
  // ============================================================
  console.log('🏆 Tạo endings...');

  await Promise.all([
    prisma.ending.create({
      data: { name: 'Wasted Potential', type: 'STANDARD', description: 'Kẻ Vứt Đi - Uy tín tụt về 0. Gara đóng cửa, giấc mơ tan vỡ. Bạn đã thất bại...' },
    }),
    prisma.ending.create({
      data: { name: 'Good Ending', type: 'STANDARD', description: 'Cái Kết Có Hậu - Sống sót 50 ngày! Gara SB-GARAGE trở thành địa điểm tin cậy trong thành phố.' },
    }),
    prisma.ending.create({
      data: { name: 'The Absolute Victory', type: 'PERFECT', description: 'Chiến Thắng Tuyệt Đối - 50 ngày, 0 thất bại! Bạn là huyền thoại không tì vết!' },
    }),
    prisma.ending.create({
      data: { name: 'Invictus', type: 'FINAL', description: 'Bất Bại - Đánh bại cả 10 Boss mạnh nhất! Gara SB-GARAGE trở thành huyền thoại vĩnh cửu!' },
    }),
    prisma.ending.create({
      data: { name: 'The Missing Percent', type: 'FINAL', description: 'Thiếu Đi Một Chút - Gần đạt được vinh quang tuyệt đối... nhưng một Boss đã hạ gục bạn.' },
    }),
    prisma.ending.create({
      data: { name: 'Bóng Ma Tốc Độ', type: 'BOSS_HIDDEN', description: 'Ending ẩn - Fail trước Kẻ Bí Ẩn... và khám phá ra bí mật kinh hoàng của hắn.' },
    }),
  ]);

  console.log('✅ Đã tạo 6 endings\n');

  // ============================================================
  // 7. QUEST CONFIGS (Cấu hình sinh khách)
  // ============================================================
  console.log('📋 Tạo quest configs...');

  await Promise.all([
    prisma.questConfig.create({
      data: { minLevel: 1, maxLevel: 3, minPowerReq: 100, maxPowerReq: 250, minGoldReward: 50, maxGoldReward: 150, minCustomers: 1, maxCustomers: 3 },
    }),
    prisma.questConfig.create({
      data: { minLevel: 4, maxLevel: 7, minPowerReq: 200, maxPowerReq: 400, minGoldReward: 100, maxGoldReward: 300, minCustomers: 2, maxCustomers: 4 },
    }),
    prisma.questConfig.create({
      data: { minLevel: 8, maxLevel: 12, minPowerReq: 350, maxPowerReq: 600, minGoldReward: 200, maxGoldReward: 500, minCustomers: 3, maxCustomers: 5 },
    }),
    prisma.questConfig.create({
      data: { minLevel: 13, maxLevel: 99, minPowerReq: 500, maxPowerReq: 800, minGoldReward: 300, maxGoldReward: 800, minCustomers: 3, maxCustomers: 6 },
    }),
  ]);

  console.log('✅ Đã tạo quest configs\n');

  // ============================================================
  // 8. LEVEL REWARDS (Quà thăng cấp)
  // ============================================================
  console.log('🎁 Tạo level rewards...');

  await Promise.all([
    prisma.levelReward.create({ data: { level: 2, cardId: cards[4].id, quantity: 2 } }),  // Lv2: 2x Động Cơ 1.5L
    prisma.levelReward.create({ data: { level: 3, cardId: cards[12].id, quantity: 2 } }), // Lv3: 2x Ống Xả Tiêu Chuẩn
    prisma.levelReward.create({ data: { level: 5, cardId: cards[5].id, quantity: 1 } }),  // Lv5: 1x Động Cơ 2.0L Turbo
    prisma.levelReward.create({ data: { level: 7, cardId: cards[10].id, quantity: 1 } }), // Lv7: 1x Turbo Tăng Áp Đôi
    prisma.levelReward.create({ data: { level: 10, cardId: cards[14].id, quantity: 1 } }), // Lv10: 1x Ống Xả Titan Racing
    prisma.levelReward.create({ data: { level: 15, cardId: cards[7].id, quantity: 1 } }), // Lv15: 1x V8 Supercharged
  ]);

  console.log('✅ Đã tạo level rewards\n');

  // ============================================================
  // 9. ACHIEVEMENTS (Thành tựu cho Crew ẩn)
  // ============================================================
  console.log('🏅 Tạo achievements...');

  await Promise.all([
    prisma.achievement.create({
      data: {
        code: 'HEAT_SURVIVOR',
        name: 'Kẻ Sống Sót Trong Lửa',
        description: 'Chạy thử xe với Heat >90% từ đầu đến cuối mà không nổ máy.',
        conditionType: 'HEAT_FULL_RUN_90',
        conditionValue: 90,
        rewardCrewId: cards[36].id, // The Fugitive
        isHidden: true,
      },
    }),
    prisma.achievement.create({
      data: {
        code: 'EXPLOSION_MASTER',
        name: 'Bậc Thầy Nổ Máy',
        description: 'Để xe nổ máy 10 lần trong cùng một phiên chơi.',
        conditionType: 'TOTAL_EXPLOSIONS',
        conditionValue: 10,
        rewardCrewId: cards[37].id, // Ghost Mechanic
        isHidden: true,
      },
    }),
    prisma.achievement.create({
      data: {
        code: 'ZERO_COST_WIN',
        name: 'Chiến Thắng Với Giá 0 Đồng',
        description: 'Hoàn thành quest chỉ dùng linh kiện miễn phí/Common mà đạt đủ yêu cầu mã lực.',
        conditionType: 'ZERO_COST_QUEST',
        conditionValue: 1,
        rewardCrewId: cards[38].id, // The CEO
        isHidden: true,
      },
    }),
    prisma.achievement.create({
      data: {
        code: 'MIDNIGHT_HACKER',
        name: 'Hacker Nửa Đêm',
        description: 'Nhấn vào đồng hồ trong gara 13 lần vào lúc nửa đêm.',
        conditionType: 'SECRET_CLOCK',
        conditionValue: 13,
        rewardCrewId: cards[39].id, // Black-Hat
        isHidden: true,
      },
    }),
    prisma.achievement.create({
      data: {
        code: 'LEGENDARY_SACRIFICE',
        name: 'Hiến Tế Huyền Thoại',
        description: 'Sở hữu ít nhất 1 thẻ Legendary mỗi loại và bán hết cho Tay Buôn Lậu.',
        conditionType: 'SELL_ALL_LEGENDARY',
        conditionValue: 1,
        rewardCrewId: cards[40].id, // The Legend
        isHidden: true,
      },
    }),
  ]);

  console.log('✅ Đã tạo 5 achievements\n');

  console.log('🎉 SEED HOÀN TẤT! SB-GARAGE sẵn sàng hoạt động!');
  console.log(`📊 Tổng kết:`);
  console.log(`   - ${cards.length} thẻ bài (30 linh kiện + 6 crew thường + 5 crew ẩn)`);
  console.log(`   - 20 hiệu ứng đặc biệt (9 linh kiện + 11 crew)`);
  console.log(`   - 25 combos`);
  console.log(`   - 12 Boss configs`);
  console.log(`   - 7 game events`);
  console.log(`   - 6 endings`);
  console.log(`   - 4 quest configs`);
  console.log(`   - 6 level rewards`);
  console.log(`   - 5 achievements (crew ẩn)`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });


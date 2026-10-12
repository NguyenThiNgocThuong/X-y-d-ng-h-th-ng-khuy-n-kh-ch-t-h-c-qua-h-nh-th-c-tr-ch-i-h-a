// Tạo tài khoản demo kèm chỉ số, thú cưng, mục tiêu và vài cây trong vườn.
// Chạy: npm run seed:demo  (sau khi đã import database/schema.sql và database/seed.sql)
// Chạy lại nhiều lần được: tài khoản demo cũ sẽ bị xóa và tạo lại.
import bcrypt from 'bcryptjs';
import pool, { withTransaction } from '../src/config/db.js';

const PASSWORD = '123456';

const demoUsers = [
  {
    email: 'demo@studygarden.vn',
    displayName: 'Bạn Demo',
    stats: { totalXp: 640, level: 4, coins: 120, currentStreak: 5, longestStreak: 9, totalMinutes: 640 },
    pet: { name: 'Bé Mầm', stage: 'baby', satiety: 70, mood: 'happy' },
    plants: [
      { seed: 'seed_sunflower', x: 0, y: 0, stage: 'mature', watered: 14 },
      { seed: 'seed_tulip', x: 1, y: 0, stage: 'young', watered: 7 },
      { seed: 'seed_cactus', x: 2, y: 1, stage: 'sprout', watered: 3 },
    ],
    goal: {
      title: 'Ôn tập Cấu trúc dữ liệu',
      targetMinutes: 600,
      tasks: ['Danh sách liên kết', 'Ngăn xếp và hàng đợi', 'Cây nhị phân tìm kiếm'],
    },
  },
  {
    email: 'sinhvien@studygarden.vn',
    displayName: 'Sinh Viên Mới',
    stats: { totalXp: 0, level: 1, coins: 50, currentStreak: 0, longestStreak: 0, totalMinutes: 0 },
    pet: { name: 'Trứng Nhỏ', stage: 'egg', satiety: 80, mood: 'normal' },
    plants: [],
    goal: null,
  },
];

// Ngày hôm nay theo giờ máy, dạng YYYY-MM-DD cho cột DATE
const today = () => new Date().toLocaleDateString('sv-SE');

async function seed() {
  const passwordHash = await bcrypt.hash(PASSWORD, 10);
  const [seedItems] = await pool.query("SELECT id, model_key FROM items WHERE type = 'seed'");
  if (seedItems.length === 0) throw new Error('Bảng items trống - hãy import database/seed.sql trước');
  const seedId = Object.fromEntries(seedItems.map((i) => [i.model_key, i.id]));

  await withTransaction(async (conn) => {
    await conn.query('DELETE FROM users WHERE email IN (?)', [demoUsers.map((u) => u.email)]);

    for (const u of demoUsers) {
      const [userResult] = await conn.query(
        'INSERT INTO users (email, password_hash, display_name) VALUES (?, ?, ?)',
        [u.email, passwordHash, u.displayName],
      );
      const userId = userResult.insertId;
      const s = u.stats;

      await conn.query(
        `INSERT INTO user_stats
           (user_id, total_xp, level, coins, current_streak, longest_streak, last_study_date, total_minutes)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [userId, s.totalXp, s.level, s.coins, s.currentStreak, s.longestStreak,
          s.currentStreak > 0 ? today() : null, s.totalMinutes],
      );

      await conn.query(
        'INSERT INTO pets (user_id, name, stage, satiety, mood) VALUES (?, ?, ?, ?, ?)',
        [userId, u.pet.name, u.pet.stage, u.pet.satiety, u.pet.mood],
      );

      for (const p of u.plants) {
        await conn.query(
          `INSERT INTO plants (user_id, seed_item_id, slot_x, slot_y, stage, watered_sessions)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [userId, seedId[p.seed], p.x, p.y, p.stage, p.watered],
        );
      }

      if (u.goal) {
        const [goalResult] = await conn.query(
          'INSERT INTO goals (user_id, title, target_minutes) VALUES (?, ?, ?)',
          [userId, u.goal.title, u.goal.targetMinutes],
        );
        for (const title of u.goal.tasks) {
          await conn.query('INSERT INTO tasks (goal_id, title, estimated_pomodoros) VALUES (?, ?, 2)', [
            goalResult.insertId,
            title,
          ]);
        }
      }
    }
  });

  console.log('Đã tạo tài khoản demo (mật khẩu: 123456):');
  demoUsers.forEach((u) => console.log(`  - ${u.email}`));
}

try {
  await seed();
} catch (err) {
  console.error('Seed thất bại:', err.code || err.message);
  process.exitCode = 1;
} finally {
  await pool.end();
}

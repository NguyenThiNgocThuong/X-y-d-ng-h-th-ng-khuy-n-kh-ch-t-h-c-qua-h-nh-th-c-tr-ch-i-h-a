// Mọi hằng số của luật trò chơi hóa nằm ở đây để chỉnh sau buổi kiểm thử với GVHD
// mà không phải sửa code xử lý.
const gamificationConfig = {
  session: {
    defaultMinutes: 25,
    minValidMinutes: 5, // dừng sớm dưới mức này thì không tính
  },
  xp: {
    perMinute: 1,
    taskCompleted: 10,
    goalCompleted: 50,
    dailyCapFromSessions: 300,
  },
  coins: {
    minutesPerCoin: 5,
    streakMilestones: { 3: 10, 7: 30, 30: 100 }, // số ngày: số xu thưởng
  },
  level: {
    // Tổng XP cần để đạt cấp n = base * n * (n - 1)  =>  lên cấp n+1 cần thêm 100 * n XP
    base: 50,
  },
  pet: {
    maxSatiety: 100,
    satietyLossPerDay: 20,
    satietyPerSession: 10,
    hungryBelow: 30,
    sadAfterIdleDays: 2,
    // Giai đoạn phát triển theo tổng số giờ học
    stageHours: { egg: 0, baby: 2, teen: 10, adult: 30 },
  },
  plant: {
    // Giai đoạn theo số phiên học đã "tưới"
    stageSessions: { seed: 0, sprout: 2, young: 6, mature: 12, bloom: 20 },
    witherAfterIdleDays: 3,
    regressAfterIdleDays: 5,
    gardenSize: 3, // khu vườn 3 x 3 ô
  },
  leaderboard: {
    size: 20,
  },
};

export default gamificationConfig;

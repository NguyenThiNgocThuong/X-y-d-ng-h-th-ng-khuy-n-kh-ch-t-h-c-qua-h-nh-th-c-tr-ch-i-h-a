// Đọc biến môi trường từ server/.env (tính năng có sẵn của Node >= 20.12, không cần dotenv)
try {
  process.loadEnvFile(new URL('../../.env', import.meta.url));
} catch {
  console.warn('[env] Không tìm thấy server/.env, dùng giá trị mặc định. Hãy copy .env.example thành .env');
}

const env = {
  port: Number(process.env.PORT) || 5000,
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'study_garden',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'dev-secret',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },
};

export default env;

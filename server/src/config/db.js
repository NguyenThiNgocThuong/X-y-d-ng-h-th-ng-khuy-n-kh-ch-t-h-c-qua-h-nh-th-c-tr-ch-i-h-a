import mysql from 'mysql2/promise';
import env from './env.js';

// Pool kết nối dùng chung cho toàn bộ API
const pool = mysql.createPool({
  ...env.db,
  waitForConnections: true,
  connectionLimit: 10,
  dateStrings: true, // trả DATE/DATETIME dạng chuỗi, tránh lệch múi giờ khi gửi về client
});

export async function pingDatabase() {
  const [rows] = await pool.query('SELECT VERSION() AS version');
  return rows[0].version;
}

// Chạy nhiều câu lệnh trong một transaction: cùng thành công hoặc cùng hủy
export async function withTransaction(work) {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const result = await work(conn);
    await conn.commit();
    return result;
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
}

export default pool;

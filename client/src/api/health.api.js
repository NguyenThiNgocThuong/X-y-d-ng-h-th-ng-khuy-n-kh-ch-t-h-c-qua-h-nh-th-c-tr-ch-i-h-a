import http from './http.js';

// Trả về { status, time, database } kể cả khi server báo 503 (CSDL chưa kết nối)
export async function getHealth() {
  const res = await http.get('/health', { validateStatus: (s) => s === 200 || s === 503 });
  return res.data;
}

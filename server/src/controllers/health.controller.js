import { pingDatabase } from '../config/db.js';

// GET /api/health - kiểm tra API và kết nối CSDL
export async function getHealth(req, res) {
  let database = { connected: false };
  try {
    database = { connected: true, version: await pingDatabase() };
  } catch (err) {
    database = { connected: false, error: err.code || err.message };
  }

  res.status(database.connected ? 200 : 503).json({
    status: database.connected ? 'ok' : 'degraded',
    time: new Date().toISOString(),
    database,
  });
}

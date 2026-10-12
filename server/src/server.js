import app from './app.js';
import env from './config/env.js';
import { pingDatabase } from './config/db.js';

app.listen(env.port, async () => {
  console.log(`[server] API chạy tại http://localhost:${env.port}/api`);
  try {
    const version = await pingDatabase();
    console.log(`[db] Đã kết nối ${env.db.database} (${version})`);
  } catch (err) {
    console.error(`[db] Chưa kết nối được MySQL: ${err.code || err.message}`);
    console.error('[db] Kiểm tra XAMPP đã Start MySQL và đã import database/schema.sql chưa.');
  }
});

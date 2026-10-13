import { Router } from 'express';
import healthRoutes from './health.routes.js';

// Gom tất cả route của API. Các đợt sau thêm: auth, users, goals, tasks, sessions,
// gamification, pet, garden, shop, stats, leaderboard.
const router = Router();

// GET /api - thông tin chung và danh sách endpoint hiện có
router.get('/', (req, res) => {
  res.json({
    name: 'Study Garden API',
    version: '0.1.0',
    endpoints: ['GET /api/health'],
  });
});

router.use('/health', healthRoutes);

export default router;

import { Router } from 'express';
import healthRoutes from './health.routes.js';

// Gom tất cả route của API. Các đợt sau thêm: auth, users, goals, tasks, sessions,
// gamification, pet, garden, shop, stats, leaderboard.
const router = Router();

router.use('/health', healthRoutes);

export default router;

import express from 'express';
import { getDailyPool, setDailyPool } from '../controllers/daily.controller.js';

const router = express.Router();

router.get('/', getDailyPool);
router.post('/', setDailyPool);

export default router;
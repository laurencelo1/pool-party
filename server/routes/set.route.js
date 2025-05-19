import express from 'express';
import { getSetCards } from '../controllers/set.controller.js';

const router = express.Router();

// GET /set/:setCode - Get all cards from a set
router.get("/:setCode", getSetCards);

export default router;
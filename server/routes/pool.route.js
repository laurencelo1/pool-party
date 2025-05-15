import express from 'express';
import { getPools, postPool, updatePool, deletePool } from '../controllers/pool.controller.js';

const router = express.Router();
router.get("/", getPools);
router.post('/', postPool);
router.put('/:id', updatePool);
router.delete('/:id', deletePool);

export default router;
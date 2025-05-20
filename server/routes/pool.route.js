import express from 'express';
import {
    getPools,
    getPoolById,
    postPool,
    updatePool,
    deletePool,
} from '../controllers/pool.controller.js';

const router = express.Router();
router.get('/', getPools);
router.get('/:id', getPoolById);
router.post('/', postPool);
router.put('/:id', updatePool);
router.delete('/:id', deletePool);

export default router;

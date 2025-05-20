import express from 'express';
import { 
    getBuilds, 
    getBuildsByPoolId,
    getBuildById,
    createBuild,
    updateBuild,
    deleteBuild, 
    initializeFromPool 
} from '../controllers/build.controller.js';

const router = express.Router();

router.get('/', getBuilds);
router.get('/pool/:poolId', getBuildsByPoolId);
router.get('/:id', getBuildById);
router.post('/', createBuild);
router.post('/init/:poolId', initializeFromPool);
router.put('/:id', updateBuild);
router.delete('/:id', deleteBuild);

export default router;
import express from 'express';
import { searchCards } from '../controllers/search.controller.js';

const router = express.Router();

// GET /search?query=card_name&set=optional_set_code
router.get('/', searchCards);

export default router;
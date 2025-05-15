import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { connectDB } from './config/db.js';
import dotenv from 'dotenv';
import Pool from "./models/pool.model.js";

// dotenv.config();


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '..', '.env') });

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = 'localhost';

app.use(cors());
app.use(express.json());
// console.log(process.env.MONGO_URI);
  
app.get('/', (req, res) => {
    // console.log(process.env.MONGO_URI);

    res.json({ message: 'Hello from Pool Party API!' });
});

app.post('/submit-pool', async (req, res) => {
    const pool = req.body;
    console.log(req.body);
    if (!pool.set || !pool.mainboard || !pool.sideboard || !pool.user) {
        return res.status(400).json({ success:false, message: 'Please fill all fields'});
    }

    const newPool = new Pool(pool);

    try {
        await newPool.save();
        res.status(201).json({ success:true, message: 'Pool submitted successfully', data: newPool});
    } catch (error) {
        console.error('submitting new pool' + error);
        res.status(500).json({ success:false, message: 'Error submitting pool'});
    }
});

app.listen(PORT, HOST, () => {
    connectDB();
    console.log(`Server running on port ${PORT}`);
});
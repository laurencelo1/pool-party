import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { connectDB } from './config/db.js';
import dotenv from 'dotenv';
import Pool from "./models/pool.model.js";
import poolRoutes from "./routes/pool.route.js";
import dailyRoutes from "./routes/daily.route.js";
import setRoutes from "./routes/set.route.js";
import searchRoutes from "./routes/search.route.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '..', '.env') });

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = 'localhost';

app.use(cors());
app.use(express.json());
app.use("/pool", poolRoutes);
app.use("/daily", dailyRoutes);
app.use("/set", setRoutes);
app.use("/search", searchRoutes);

app.listen(PORT, HOST, () => {
    connectDB();
    console.log(`Server running on port ${PORT}`);
});
// console.log(process.env.MONGO_URI);

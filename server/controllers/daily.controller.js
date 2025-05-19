import DailyPool from "../models/daily.model.js";
import Pool from "../models/pool.model.js";
import mongoose from "mongoose";

export const getDailyPool = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Find the daily pool for today
        let dailyPool = await DailyPool.findOne({
            date: {
                $gte: today,
                $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
            }
        });

        // If no daily pool for today, get the most recent one
        if (!dailyPool) {
            dailyPool = await DailyPool.findOne().sort({ date: -1 });
        }

        if (!dailyPool) {
            return res.status(404).json({
                success: false,
                message: 'No daily pool found'
            });
        }

        const pool = await Pool.findById(dailyPool.poolId);
        
        if (!pool) {
            return res.status(404).json({
                success: false,
                message: 'Pool referenced by daily pool not found'
            });
        }

        res.status(200).json({
            success: true,
            data: {
                dailyPool,
                pool
            }
        });
    } catch (error) {
        console.error('Error fetching daily pool:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching daily pool'
        });
    }
};

export const setDailyPool = async (req, res) => {
    try {
        const { poolId } = req.body;

        // Validate poolId
        if (!poolId || !mongoose.Types.ObjectId.isValid(poolId)) {
            return res.status(400).json({
                success: false,
                message: 'Valid pool ID is required'
            });
        }

        // Check if pool exists
        const pool = await Pool.findById(poolId);
        if (!pool) {
            return res.status(404).json({
                success: false,
                message: 'Pool not found'
            });
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Check if we already have a daily pool for today
        let dailyPool = await DailyPool.findOne({
            date: {
                $gte: today,
                $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
            }
        });

        if (dailyPool) {
            // Update existing daily pool
            dailyPool.poolId = poolId;
            await dailyPool.save();
        } else {
            // Create new daily pool
            dailyPool = new DailyPool({
                poolId,
                date: today
            });
            await dailyPool.save();
        }

        res.status(200).json({
            success: true,
            message: 'Daily pool set successfully',
            data: dailyPool
        });
    } catch (error) {
        console.error('Error setting daily pool:', error);
        res.status(500).json({
            success: false,
            message: 'Error setting daily pool'
        });
    }
};
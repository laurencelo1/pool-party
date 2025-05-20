import Build from '../models/build.model.js';
import Pool from '../models/pool.model.js';
import mongoose from 'mongoose';

export const getBuilds = async (req, res) => {
    try {
        const builds = await Build.find();
        res.status(200).json({ success: true, data: builds });
    } catch (error) {
        console.error('Error fetching builds:', error);
        res.status(500).json({ success: false, message: 'Error fetching builds' });
    }
};

export const getBuildsByPoolId = async (req, res) => {
    try {
        const { poolId } = req.params;
        const builds = await Build.find({ poolId });
        res.status(200).json({ success: true, data: builds });
    } catch (error) {
        console.error('Error fetching builds:', error);
        res.status(500).json({ success: false, message: 'Error fetching builds' });
    }
};

export const getBuildById = async (req, res) => {
    try {
        const { id } = req.params;
        const build = await Build.findById(id);

        if (!build) {
            return res.status(404).json({ success: false, message: 'Build not found' });
        }

        res.status(200).json({ success: true, data: build });
    } catch (error) {
        console.error('Error fetching build:', error);
        res.status(500).json({ success: false, message: 'Error fetching build' });
    }
};

export const createBuild = async (req, res) => {
    try {
        const { poolId, mainboard, sideboard, name, user } = req.body;

        // Validate poolId
        if (!poolId || !mongoose.Types.ObjectId.isValid(poolId)) {
            return res.status(400).json({ success: false, message: 'Valid pool ID is required' });
        }

        // Check if pool exists
        const pool = await Pool.findById(poolId);
        if (!pool) {
            return res.status(404).json({ success: false, message: 'Parent pool not found' });
        }

        // Create new build
        const newBuild = new Build({
            poolId,
            mainboard: mainboard || [],
            sideboard: sideboard || pool.sideboard || [], // Use pool's sideboard as default
            name: name || 'Untitled Build',
            user: user || 'Guest',
        });

        await newBuild.save();

        res.status(201).json({
            success: true,
            message: 'Build created successfully',
            data: newBuild,
        });
    } catch (error) {
        console.error('Error creating build:', error);
        res.status(500).json({ success: false, message: 'Error creating build' });
    }
};

export const updateBuild = async (req, res) => {
    try {
        const { id } = req.params;
        const { mainboard, sideboard, name } = req.body;

        const build = await Build.findById(id);

        if (!build) {
            return res.status(404).json({ success: false, message: 'Build not found' });
        }

        // Update build fields
        build.mainboard = mainboard || build.mainboard;
        build.sideboard = sideboard || build.sideboard;
        if (name) build.name = name;

        await build.save();

        res.status(200).json({
            success: true,
            message: 'Build updated successfully',
            data: build,
        });
    } catch (error) {
        console.error('Error updating build:', error);
        res.status(500).json({ success: false, message: 'Error updating build' });
    }
};

export const deleteBuild = async (req, res) => {
    try {
        const { id } = req.params;

        const build = await Build.findByIdAndDelete(id);

        if (!build) {
            return res.status(404).json({ success: false, message: 'Build not found' });
        }

        res.status(200).json({
            success: true,
            message: 'Build deleted successfully',
            data: build,
        });
    } catch (error) {
        console.error('Error deleting build:', error);
        res.status(500).json({ success: false, message: 'Error deleting build' });
    }
};

// Helper function to initialize a build from a pool
export const initializeFromPool = async (req, res) => {
    try {
        const { poolId } = req.params;

        // Validate poolId
        if (!poolId || !mongoose.Types.ObjectId.isValid(poolId)) {
            return res.status(400).json({ success: false, message: 'Valid pool ID is required' });
        }

        // Get pool data
        const pool = await Pool.findById(poolId);
        if (!pool) {
            return res.status(404).json({ success: false, message: 'Pool not found' });
        }

        // Create a build with empty mainboard and pool's cards in sideboard
        const newBuild = new Build({
            poolId,
            mainboard: [],
            sideboard: [...pool.mainboard, ...pool.sideboard], // All cards go to sideboard initially
            name: `Build from ${pool.set} pool`,
            user: req.body.user || 'Guest',
        });

        await newBuild.save();

        res.status(201).json({
            success: true,
            message: 'Build initialized successfully',
            data: newBuild,
        });
    } catch (error) {
        console.error('Error initializing build:', error);
        res.status(500).json({ success: false, message: 'Error initializing build' });
    }
};

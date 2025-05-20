import Pool from '../models/pool.model.js';

export const getPools = async (req, res) => {
    try {
        const pools = await Pool.find();
        res.status(200).json({ success: true, data: pools });
    } catch (error) {
        console.error('Error fetching pools' + error);
        res.status(500).json({ success: false, message: 'Error fetching pools' });
    }
};

export const getPoolById = async (req, res) => {
    try {
        const { id } = req.params;
        const pool = await Pool.findById(id);
        if (!pool) {
            return res.status(404).json({ success: false, message: 'Pool not found' });
        }
        res.status(200).json({ success: true, data: pool });
    } catch (error) {
        console.error('Error fetching pool' + error);
        res.status(500).json({ success: false, message: 'Error fetching pool' });
    }
};

export const postPool = async (req, res) => {
    const pool = req.body;
    console.log(req.body);
    if (!pool.set || !pool.mainboard || !pool.sideboard || !pool.user) {
        return res.status(400).json({ success: false, message: 'Please fill all fields' });
    }

    const newPool = new Pool(pool);

    try {
        await newPool.save();
        res.status(201).json({
            success: true,
            message: 'Pool submitted successfully',
            data: newPool,
        });
    } catch (error) {
        console.error('submitting new pool' + error);
        res.status(500).json({ success: false, message: 'Error submitting pool' });
    }
};

export const updatePool = async (req, res) => {
    const { id } = req.params;
    const pool = req.body;

    if (!pool.set || !pool.mainboard || !pool.sideboard || !pool.user) {
        return res.status(400).json({ success: false, message: 'Please fill all fields' });
    }

    try {
        const updatedPool = await Pool.findByIdAndUpdate(id, pool, { new: true });
        if (!updatedPool) {
            return res.status(404).json({ success: false, message: 'Pool not found' });
        }
        res.status(200).json({
            success: true,
            message: 'Pool updated successfully',
            data: updatedPool,
        });
    } catch (error) {
        console.error('Error updating pool' + error);
        res.status(500).json({ success: false, message: 'Error updating pool' });
    }
};

export const deletePool = async (req, res) => {
    const { id } = req.params;
    console.log('id', id);

    try {
        const pool = await Pool.findByIdAndDelete(id);
        if (!pool) {
            return res.status(404).json({ success: false, message: 'Pool not found' });
        }
        res.status(200).json({
            success: true,
            message: 'Pool deleted successfully',
            data: pool,
        });
    } catch (error) {
        console.error('Error deleting pool' + error);
        res.status(500).json({ success: false, message: 'Error deleting pool' });
    }
};

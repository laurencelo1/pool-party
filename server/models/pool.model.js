import mongoose from 'mongoose';

const poolSchema = new mongoose.Schema(
    {
        set: {
            type: String,
            required: true,
        },
        mainboard: {
            type: Array,
            required: true,
        },
        sideboard: {
            type: Array,
            required: true,
        },
        user: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const Pool = mongoose.model('Pool', poolSchema);
export default Pool;

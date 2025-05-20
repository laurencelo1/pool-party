import mongoose from "mongoose";

const buildSchema = new mongoose.Schema({
    poolId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Pool',
        required: true
    },
    mainboard: {
        type: Array,
        required: true
    },
    sideboard: {
        type: Array,
        required: true
    },
    name: {
        type: String,
        required: true,
        default: 'Untitled Build'
    },
    user: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

const Build = mongoose.model('Build', buildSchema);
export default Build;
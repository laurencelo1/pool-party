import mongoose from 'mongoose';

const dailyPoolSchema = new mongoose.Schema(
    {
        poolId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Pool',
            required: true,
        },
        date: {
            type: Date,
            default: Date.now,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

// Only one daily pool per date
dailyPoolSchema.index({ date: 1 }, { unique: true });

const DailyPool = mongoose.model('DailyPool', dailyPoolSchema);
export default DailyPool;

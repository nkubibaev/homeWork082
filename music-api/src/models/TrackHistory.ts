import mongoose, { Model } from 'mongoose';
import { TrackHistoryFields } from '../types.js';

const Schema = mongoose.Schema;

const TrackHistorySchema = new Schema<TrackHistoryFields>({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },

    track: {
        type: Schema.Types.ObjectId,
        ref: 'Track',
        required: true,
    },

    artist: {
        type: Schema.Types.ObjectId,
        ref: 'Artist',
        required: true,
    },

    datetime: {
        type: Date,
        required: true,
    },
});

const TrackHistory: Model<TrackHistoryFields> =
    mongoose.model('TrackHistory', TrackHistorySchema);

export default TrackHistory;
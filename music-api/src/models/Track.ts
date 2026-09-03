import { Schema, model } from 'mongoose';

const trackSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        album: {
            type: Schema.Types.ObjectId,
            ref: 'Album',
            required: true,
        },
        trackNumber: {
            type: Number,
            required: true,
        },
        duration: {
            type: String,
            required: true,
            trim: true,
        },
        youtubeUrl: {
            type: String,
            required: false,
            default: null,
            trim: true,
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        isPublished: {
            type: Boolean,
            default: false,
            required: true,
        },
    },
    {
        versionKey: false,
    },
);


const Track = model('Track', trackSchema);
export default Track;
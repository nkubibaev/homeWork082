import { Schema, model } from 'mongoose';

const albumSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        artist: {
            type: Schema.Types.ObjectId,
            ref: 'Artist',
            required: true,
        },
        year: {
            type: Number,
            required: true,
        },
        image: {
            type: String,
            required: false,
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

const Album = model('Album', albumSchema);
export default Album;
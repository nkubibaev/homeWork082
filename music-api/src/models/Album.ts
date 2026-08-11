import { Schema, model, Types } from 'mongoose';

const albumSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        artist: {
            type: Types.ObjectId,
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
    },
    {
        versionKey: false,
    },
);

const Album = model('Album', albumSchema);
export default Album;

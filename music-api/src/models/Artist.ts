import { Schema, model } from 'mongoose';

const artistSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        photo: {
            type: String,
            required: false,
        },
        information: {
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

const Artist = model('Artist', artistSchema);
export default Artist;
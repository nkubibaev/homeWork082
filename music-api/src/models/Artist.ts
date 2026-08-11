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
    },
    {
        versionKey: false,
    },
);

const Artist = model('Artist', artistSchema);
export default Artist;
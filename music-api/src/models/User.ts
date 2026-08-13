import mongoose, { Model } from 'mongoose';
import { UserFields } from '../types.js';
import bcrypt from 'bcrypt';

const Schema = mongoose.Schema;
const SALT_WORK_FACTOR = 10;

const UserSchema = new Schema<UserFields>({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    token: {
        type: String,
        required: true,
    },
});

UserSchema.pre('save', async function () {
    const salt: string = await bcrypt.genSalt(SALT_WORK_FACTOR);
    const hash: string = await bcrypt.hash(this.password, salt);

    this.password = hash;
});

UserSchema.set('toJSON', {
    transform: (_, ret: Partial<UserFields>) => {
        delete ret.password;

        return ret;
    },
});


const User: Model<UserFields> = mongoose.model('User', UserSchema);
export default User;
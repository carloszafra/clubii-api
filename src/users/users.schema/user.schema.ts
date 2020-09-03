import { Schema } from 'mongoose';
import { hash, compare, genSalt} from 'bcrypt';

export const UserSchema = new Schema({
    name: { type: String, required: true},
    description: String,
    username: { type: String, required: true, unique: true},
    email: { type: String, required: true, unique: true},
    birthday: String,
    country: { type: String, required: true},
    twitter: String,
    instagram: String,
    avatarUrl: String,
    coverUrl: String,
    password: { type: String, required: true},
    timestamp: { type: Date, default: Date.now}
})

UserSchema.methods.hashPassword = async ( password: string ): Promise<string> => {
    const salt = await genSalt(10);
    return await hash(password, salt);
}

UserSchema.methods.comparePasswords = async function( password: string ): Promise<boolean> {
   return await compare( password, this.password);
}
import { Schema } from 'mongoose';

export const likeSchema = new Schema({
    publication: { ref: 'Publication', type: Schema.Types.ObjectId },
    user: { ref: 'User', type: Schema.Types.ObjectId },
    timestamp: { type: Date, default: Date.now }
})
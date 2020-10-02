import { timingSafeEqual } from 'crypto';
import { Schema } from 'mongoose';

export const comentSchema = new Schema({
    user: { ref: 'User', type: Schema.Types.ObjectId },
    publication: { ref: 'Publication', type: Schema.Types.ObjectId },
    content: { type: String},
    timestamp: { type: Date, default: Date.now}
})
import { Schema } from 'mongoose';

export const comentSchema = new Schema({
    publication: { ref: 'Publication', type: Schema.Types.ObjectId },
    user: { ref: 'User', type: Schema.Types.ObjectId },
    content: { type: String },
    timestamp: { type: Date, default: Date.now }
})
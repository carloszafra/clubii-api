import { Schema } from 'mongoose';

export const publicationSchema = new Schema({
    creator: { ref: 'User', type: Schema.Types.ObjectId },
    content: { type: String, required: true },
    fileUrl: { type: String, default: null },
    timestamp: { type: Date, default: Date.now }
})
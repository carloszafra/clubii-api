import { Document } from "mongoose"

export interface comentI extends Document{
    publication: string;
    user: string;
    content: string;
    timestamp: Date
}
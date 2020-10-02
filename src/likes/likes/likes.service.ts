import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { likeI } from '../interface/likes.interface';

@Injectable()
export class LikesService {

    constructor( @InjectModel('Like') private likesModel: Model<likeI>){}

    async postLike( pubId: string, userId: string ): Promise<likeI> {
       
        try {
            const prelike = new this.likesModel();
            prelike.publication = pubId;
            prelike.user = userId;
            const like = await prelike.save();
            await like.populate('user', '_id name username email avatarUrl').populate('publication').execPopulate();
            return like;

        } catch (error) {
            throw new HttpException('Like no ejecutado', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}

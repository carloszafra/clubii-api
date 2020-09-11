import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { followI } from '../interface/follow.interface';

@Injectable()
export class FollowsService {

    constructor( @InjectModel('Follow') private followModel: Model<followI> ){}

    async createFollow( followerId: string, followedId: string): Promise<followI> {
       
        try{
            const follow = new this.followModel();
            follow.follower = followerId;
            follow.followed = followedId;
            const savedFollow = await follow.save();
            await savedFollow.populate({path: 'follower followed'}).execPopulate();
            return savedFollow;

        }catch(err){
            throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
        }
       
    }
}

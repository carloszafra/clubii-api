import { Injectable, HttpException, HttpStatus, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { followI } from '../interface/follow.interface';

@Injectable()
export class FollowsService {

    constructor(@InjectModel('Follow') private followModel: Model<followI>) { }

    async createFollow(followerId: string, followedId: string): Promise<followI> {

        try {
            const follow = new this.followModel();
            follow.follower = followerId;
            follow.followed = followedId;
            const savedFollow = await follow.save();
            await savedFollow.populate({ path: 'follower followed' }).execPopulate();
            return savedFollow;

        } catch (err) {
            throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    async getFollowers(followedId: string, page: number): Promise<any[]> {

        const followers = await Promise.all([
            this.followModel.find({ followed: followedId }).skip(page).limit(5),
            this.followModel.countDocuments({ followed: followedId })
        ]);

        return followers;
    }

    async getFollowing(followerId: string, page: number ): Promise<any[]> {
       
        const following = await Promise.all([
            this.followModel.find({follower: followerId}).skip(page).limit(5),
            this.followModel.countDocuments({follower: followerId})
        ]);

        return following;
    }
}

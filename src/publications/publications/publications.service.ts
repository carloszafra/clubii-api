import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { publicationI } from '../interfaces/publication.interface';
import { userI } from 'src/users/users.interface/user.interface';
import { publicationDto } from '../publicationDto/publication.dto';
import { FollowsService } from 'src/follows/follows/follows.service';
import { FriendshipService } from 'src/friendship/friendship/friendship.service';

@Injectable()
export class PublicationsService {

    constructor( 
        @InjectModel('Publication') private publiModel: Model<publicationI>,
        @InjectModel('User') private userModel: Model<userI>,
        private followSvc: FollowsService,
        private friendSvc: FriendshipService
    ){}

    async createPublication( newPub: publicationDto, creatorId: any ): Promise<publicationI> {
        const publication = new this.publiModel(newPub);
        publication.creator = creatorId;
        const savedPub =  await publication.save();
        await savedPub.populate('creator').execPopulate();

        return savedPub;
    }

    async getAllPublications(): Promise<publicationI[]> {
        const publications = await this.publiModel.find().populate('creator', 'email username');
        return publications;
    }

    async getFollowedPublications(): Promise<publicationI> {
        return 
    }

    async getUserPublications( userId: string, page: number): Promise<any>{
        const publications = await Promise.all([
            this.publiModel.find({creator: userId})
             .skip(page).limit(5)
             .populate('creator', '_id name email username avatarUrl'),
            
            this.publiModel.countDocuments({creator: userId})
        ]);

        return publications;
    }

    async getNewsfeedPubs( userId: string, page: number ): Promise<publicationI[]> {
       let newsfeedPubs: publicationI[] = [];

       const [followingPubs, total1] = await this.getFollowingPubs(userId, page);
       const [friendsPubs, total2] = await this.getFriendsPubs(userId, page);
       
       const total: number = total1 + total2;
       newsfeedPubs = [...followingPubs, ...friendsPubs]
       
       return newsfeedPubs
    }

    private async getFollowingPubs(userId: string, page: number): Promise<[publicationI[], number]> {
      const follows_id = await this.followSvc.getFollowingId(userId);

      const followingPubs = await Promise.all([
            this.publiModel.find({creator: {"$in": follows_id}})
             .sort('-timestamp')
             .skip(page)
             .populate('creator', '_id name email username avatarUrl'),
            
            this.publiModel.countDocuments({creator: {$in: follows_id}})
        ]);

        return followingPubs;
    }

    private async getFriendsPubs(userId: string, page: number): Promise<[publicationI[], number]>{
        const friends_id = await this.friendSvc.getFriendsId(userId);
        friends_id.push(userId);

        const friendsPubs = await Promise.all([  
            this.publiModel.find({creator: {$in: friends_id}})
             .sort('-timestamp')
             .skip(page)
             .populate('creator', '_id name email username avatarUrl'),

            this.publiModel.countDocuments({creator: {$in: friends_id}})
        ]);

        return friendsPubs;
    }
} 

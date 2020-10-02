import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { friendshipI } from '../friendship.interface/friendship.interface';

@Injectable()
export class FriendshipService {

    constructor( @InjectModel('Friendship') private friendModel: Model<friendshipI>){}

    async createRequest( emmiterId: string, receiverId: string ): Promise<friendshipI> {
      
     try {
          const newfriendship = new this.friendModel();
          newfriendship.emmiter = emmiterId;
          newfriendship.receiver = receiverId;
          const friendship = await newfriendship.save();
          await friendship.populate({path: 'emmiter receiver'}).execPopulate();
          return friendship;
      
        } catch (error) {
            throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR); 
        }
    }

    async acceptRequest( receiverId: string, friendshipId: string):Promise<friendshipI>{
        const friendship = await this.friendModel
        .findOneAndUpdate({_id: friendshipId, receiver: receiverId, accepted: false}, {accepted: true}, {new: true});

        if(friendship){
            await friendship.populate({path: 'emmiter receiver'}).execPopulate();
            return friendship;
        }else{
            throw new HttpException('this request doesnt exists', HttpStatus.NOT_IMPLEMENTED);
        }
    }

    async rejectRequest( receiverId: string, friendshipId: string):Promise<any>{
        const deleted = await this.friendModel
        .findOneAndDelete({_id: friendshipId, receiver: receiverId, accepted: false});

        if(deleted){
            return deleted;
        }else{
            throw new HttpException('this request doesnt exists', HttpStatus.NOT_IMPLEMENTED);
        }
    }

    async getMyRequests( receiverId: string, page: number ): Promise<any[]>{
        const requests = await Promise.all([
          this.friendModel.find({receiver: receiverId, accepted: false}).populate('emmiter receiver').skip(page).limit(5),
          this.friendModel.countDocuments({receiver: receiverId})
        ]);
        
       return requests;
    }
}

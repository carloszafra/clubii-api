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

    // async getMyRequests( receiverId: string, page: number ): Promise<any[]>{
    //     try {
    //         const requests = await Promise.all([
    //             this.friendModel.find({receiver: receiverId, accepted: false}).populate('emmiter').skip(page).limit(5),
    //             this.friendModel.countDocuments({receiver: receiverId, accepted: false})
    //           ]);
              
    //           console.log(requests)
    //          return requests;
    //     } catch (error) {
    //         throw new HttpException('fallo '+ error, HttpStatus.NOT_IMPLEMENTED);
    //     }
    // }


    async getRequest( receiverId: string ): Promise<[friendshipI[], number]> {
        const requests = await Promise.all([
            this.friendModel.find({receiver: receiverId, accepted: false}).populate('emmiter'),
            this.friendModel.countDocuments({receiver: receiverId, accepted: false})
        ]);

        console.log(requests)
        return requests
    }


    async getFriendsId( userId: string ): Promise<any[]>{ 
        let emmiter_id: any[] = [];
        let receiver_Id: any[] = [];
        let friends_id: any[] = [];
        
        const [emmiterId, receiverId] = await Promise.all([
            this.friendModel.find({receiver: userId, accepted: true}),
            this.friendModel.find({emmiter: userId, accepted: true})
        ]);

        emmiterId.forEach( (friendship: friendshipI) => {
            emmiter_id.push(friendship.emmiter);
        });

        receiverId.forEach( (friendship: friendshipI) => {
            receiver_Id.push(friendship.receiver);
        });

        friends_id = [...receiver_Id, ...emmiter_id];

        console.log(friends_id);

        return friends_id;
    }

    async getPendingId(userId: string): Promise<any[]> {
        let emmiter_id: any[] = [];
        let receiver_Id: any[] = [];
        let request_id: any[] = [];

       const [emmiterId,receiverId] = await Promise.all([
            this.friendModel.find({receiver: userId, accepted: false}),
            this.friendModel.find({emmiter: userId, accepted: false})
        ]);

        emmiterId.forEach((friendship: friendshipI) => {
            emmiter_id.push(friendship.emmiter);
        });

        receiverId.forEach((friendship: friendshipI) => {
            receiver_Id.push(friendship.receiver);
        });

        request_id = [...receiver_Id, ...emmiter_id];

        return request_id;
    }
}

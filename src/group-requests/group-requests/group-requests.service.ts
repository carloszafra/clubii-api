import { HttpException, HttpStatus, Injectable, NotAcceptableException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { request } from 'express';
import { Model } from 'mongoose';
import { groupReqI } from '../groupreq.interface/groupreq.interface';

@Injectable()
export class GroupRequestsService {

    constructor( @InjectModel('GroupReq') private groupReqModel: Model<groupReqI> ){}

    async sendGroupReq( emmiterId: string, receiverId: string, groupId: string ): Promise<groupReqI> {
       
       const groupAdmins: groupReqI[] = await this.groupReqModel.find({group: groupId, accepted: true});
       if( groupAdmins.length === 3 ) throw new NotAcceptableException(HttpStatus.NOT_ACCEPTABLE, 'este grupoya tiene tres admins');
        try {
            const newGroupReq = new this.groupReqModel();
            newGroupReq.emmiter = emmiterId;
            newGroupReq.receiver = receiverId;
            newGroupReq.group = groupId;
            const newGroup = await newGroupReq.save();
            await newGroup.populate({path: 'emmiter receiver group'}).execPopulate();
            return newGroup;
        } catch (error) {
            throw new HttpException(`error al crear la solicitud: ${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async getMyRequests( receiverId: string, page: number ): Promise<any[]> {
        const request = await Promise.all([
            this.groupReqModel.find({receiver: receiverId, accepted: false})
            .populate('emmiter receiver', 'username email avatarUrl'),

            this.groupReqModel.countDocuments({receiver: receiverId, accepted: false})
        ]);

        return request;
    }

    async acceptRequest( receiverId: string, groupId: string): Promise<groupReqI> {
        const groupReq = await this.groupReqModel.findOne({_id: groupId, receiver: receiverId, accepted: false});

        if(groupReq){
            const accepted = await this.groupReqModel
            .findOneAndUpdate({ _id: groupId, receiver: receiverId, accepted: false }, {accepted: true}, {new: true});
            await accepted.populate('emmiter receiver').execPopulate();
            return accepted;
        }else{
            throw new HttpException('this request doesnt exists', HttpStatus.NOT_IMPLEMENTED);
        }
    }

    async rejectRequest( receiverId: string, groupId: string ): Promise<any> {
        const deleted = await this.groupReqModel.findOneAndDelete({_id: groupId, receiver: receiverId});
        if(deleted){
            return deleted;
        }else{
            throw new HttpException('this request doesnt exists', HttpStatus.NOT_IMPLEMENTED);
        }
    }
}

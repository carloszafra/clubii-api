import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GroupRequestsService } from 'src/group-requests/group-requests/group-requests.service';
import { groupReqI } from 'src/group-requests/groupreq.interface/groupreq.interface';
import { groupDto } from '../group.dto/group.dto';
import { groupI } from '../group.interface/group.interface';

@Injectable()
export class GroupsService {

    constructor(
        @InjectModel('Group') private groupModel: Model<groupI>,
        private groupReqSvc: GroupRequestsService
    )
    {}

    async getGroups( page: number ): Promise<any[]> {
       
        const groups = await Promise.all([
           this.groupModel.find().populate('creator').skip(page).limit(5),
           this.groupModel.countDocuments()
        ])

        return groups;
    }

    async createGroup( creatorId: string, groupDto: groupDto ): Promise<groupI> {
        try {
            const newGroup = new this.groupModel(groupDto);
            newGroup.creator = creatorId;
            const savedGroup = await newGroup.save();
            await savedGroup.populate('creator', 'name username avatarUrl').execPopulate();
            return savedGroup;
        } catch (error) {
            throw new HttpException(`error al crear el grupo: ${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async sendGroupReq( emmiterId: string, receiverId: string, groupId: string ): Promise<groupReqI>{
        const groupReq = await this.groupReqSvc.sendGroupReq(emmiterId, receiverId, groupId);
        return groupReq;
    }

    async getGroupReqs( receiver: string, page: number ): Promise<any[]> {
        const requests = await this.groupReqSvc.getMyRequests(receiver, page);
        return requests;
    }

    async acceptReq( receiverId: string, groupId: string): Promise<groupReqI> {
        const accepted = await this.groupReqSvc.acceptRequest( receiverId, groupId);
        return accepted;
    }

    async rejectReq( receiverId: string, groupId: string ): Promise<any> {
        const deleted = await this.groupReqSvc.rejectRequest(receiverId, groupId);
        return deleted;
    }
}

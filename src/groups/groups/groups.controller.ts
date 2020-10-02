import { Body, Controller, Get, HttpStatus, Param, Post, Query, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { JwtPayload } from 'src/auth/interfaces/payload.interface';
import { groupDto } from '../group.dto/group.dto';
import { GroupsService } from './groups.service';

@Controller('groups')
export class GroupsController {

    constructor( private groupSvc: GroupsService ){}

    @Get('/')
    @UseGuards(AuthGuard())
    async getGroups( @Res() res: Response, @Query('from') from: any ){
        const page = from ? Number(from) : 0;

        const [groups, total] = await this.groupSvc.getGroups(page);
        return res.status(HttpStatus.OK).json({groups, total});
    }

    @Post('/new')
    @UseGuards(AuthGuard())
    async createGroup( @Res() res: Response, @Req() req: Request, @Body() groupDto: groupDto ){
        const user = <JwtPayload>req.user;
        const group = await this.groupSvc.createGroup(user._id, groupDto);
        return res.status(HttpStatus.OK).json(group);
    }

    @Post('/request/:userId/:groupId')
    @UseGuards(AuthGuard())
    async sendGroupRequest
    (@Res()res: Response, @Req()req: Request, @Param('userId')receiverId, @Param('groupId') groupId){
       const user = <JwtPayload>req.user;
       const groupReq = await this.groupSvc.sendGroupReq(user._id, receiverId, groupId);
       return res.status(HttpStatus.OK).json(groupReq);
    }

    @Get('requests')
    @UseGuards(AuthGuard())
    async getGroupRequests( @Res() res: Response, @Req() req: Request, @Query('from') from: any){
        const user = <JwtPayload>req.user;
        const page = from ? Number(from) : 0;

        const [requests, total] = await this.groupSvc.getGroupReqs(user._id, page);

        return res.status(HttpStatus.OK).json({requests, total});
    }

    @Post('accept/:groupId')
    @UseGuards(AuthGuard())
    async acceptRequest( @Res() res: Response, @Req() req: Request, @Param('groupId') groupId: any) {
        const user = <JwtPayload>req.user;
        const accepted = await this.groupSvc.acceptReq(user._id, groupId);

        return res.status(HttpStatus.OK).json(accepted);
    }

    @Post('reject/:groupId')
    @UseGuards(AuthGuard())
    async rejectRequest( @Res() res: Response, @Req() req: Request, @Param('groupId') groupId: any ){
        const user = <JwtPayload>req.user;
        const deleted = await this.groupSvc.rejectReq(user._id, groupId);

        return res.status(HttpStatus.OK).json({message: 'request deleted'});
    }
}

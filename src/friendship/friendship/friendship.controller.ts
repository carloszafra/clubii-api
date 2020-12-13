import { Controller, Post, UseGuards, Res, Param, Req, NotImplementedException, HttpStatus, Delete, Get, Query } from '@nestjs/common';
import { FriendshipService } from './friendship.service';
import { AuthGuard } from '@nestjs/passport';
import { JwtPayload } from 'src/auth/interfaces/payload.interface';
import { Response, Request } from 'express';

@Controller('friendship')
export class FriendshipController {

    constructor( private friendSvc: FriendshipService ){}

    @Get('/:id')
    @UseGuards(AuthGuard())
    async createFriendship( @Res() res: Response, @Param('id') receiverId: any, @Req() req: Request ){
        const emmiter = <JwtPayload>req.user;

        const friendship = await this.friendSvc.createRequest(emmiter._id, receiverId);
        if(!friendship) throw new NotImplementedException('no se genero la solicitud');

       return res.status(HttpStatus.CREATED).json(friendship);
    }

    @Get('accept/:id')
    @UseGuards(AuthGuard())
    async acceptFriendship( @Res() res: Response, @Param('id') friendshipId: any, @Req() req: Request ){
        const receiver = <JwtPayload>req.user;

        const accepted = await this.friendSvc.acceptRequest(receiver._id, friendshipId);
        if(!accepted) throw new NotImplementedException('no se acepto la solicitud');

        return res.status(HttpStatus.OK).json(accepted); 
    }

    @Delete('reject/:id')
    @UseGuards(AuthGuard())
    async rejectRequest( @Res() res: Response, @Param('id') friendshipId: any, @Req() req: Request ){
        const receiver = <JwtPayload>req.user;

        const deleted = await this.friendSvc.rejectRequest(receiver._id, friendshipId);
        if(!deleted) throw new NotImplementedException('no se elimino la solicitud');

        return res.status(HttpStatus.OK).json({message: 'rejected'});
    } 

    // @Get('requests')  
    // @UseGuards(AuthGuard())
    // async getMyRequests( @Res() res: Response, @Req() req: Request, @Query('from') from: any){
        
    //     const userLoged = <JwtPayload>req.user;
    //     const page = from ? Number(from) : 0;
    //     console.log(`${userLoged}, ${page}`)

    //     const [requests, total] = await this.friendSvc.getMyRequests(userLoged._id, page);
    //     return res.status(HttpStatus.OK).json({requests, total});
    // }

    @Get('/pending/:id')
    @UseGuards(AuthGuard())
    async getRequests( @Res() res: Response, @Req() req: Request, @Param('id')id: string){
        const userLoged = <JwtPayload>req.user;
        
       
        const [requests, total] = await this.friendSvc.getRequest(id);
        return res.status(HttpStatus.OK).json({requests, total});
    }

    @Get('/friends/:id')
    @UseGuards(AuthGuard())
    async getFriendsId(@Res() res: Response, @Req() req: Request, @Param('id')id: string){
        const friendsId = await this.friendSvc.getFriendsId(id);
        return res.status(HttpStatus.OK).json(friendsId);
    }

    @Get('pendings/:id')
    @UseGuards(AuthGuard())
    async getPendingId(@Res() res: Response, @Req() req: Request, @Param('id')id: string){
        const pendingId = await this.friendSvc.getPendingId(id);
        return res.status(HttpStatus.OK).json(pendingId);
    }
}

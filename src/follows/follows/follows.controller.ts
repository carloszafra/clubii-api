import { Controller, Post, UseGuards, Res, Param, Req, NotImplementedException, HttpStatus, Get, Query } from '@nestjs/common';
import { FollowsService } from './follows.service';
import { AuthGuard } from '@nestjs/passport';
import { JwtPayload } from 'src/auth/interfaces/payload.interface';
import { Request, Response } from 'express';

@Controller('follows')
export class FollowsController {

    constructor( private followSvc: FollowsService ){}

    @Post('/:id')
    @UseGuards(AuthGuard())
    async createFollow( @Res() res, @Param('id') followedId: any, @Req() req: any ){
        const follower = <JwtPayload>req.user;
        
        const follow = await this.followSvc.createFollow(follower._id, followedId);
        if(!follow) throw new NotImplementedException('no se hizo el follow');

        return res.status(HttpStatus.OK).json(follow);
    }

    @Get('/followers/:id?')
    @UseGuards(AuthGuard())
    async getFollowers
    ( @Res() res: Response, @Req() req: Request, @Param('id') userId: any, @Query('from') from: any ){
        
        const followed = <JwtPayload>req.user;
        const user = userId ? userId : followed._id;
        const page = from ? Number(from) : 0;

        const [followers, total] = await this.followSvc.getFollowers(user, page);

        return res.status(HttpStatus.OK).json({followers, total});
    }

    @Get('/following/:id?')
    @UseGuards(AuthGuard())
    async getFollowing
    ( @Res() res: Response, @Req() req: Request, @Param('id') userId: any, @Query('from') from: any ){
       
        const follower = <JwtPayload>req.user;
        const user = userId ? userId : follower._id;
        const page = from ? Number(from) : 0;

        const [following, total] = await this.followSvc.getFollowing(user, page);

        return res.status(HttpStatus.OK).json({following, total});
    }
}

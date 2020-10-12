import { Controller, HttpStatus, Param, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { JwtPayload } from 'src/auth/interfaces/payload.interface';
import { LikesService } from './likes.service';

@Controller('likes')
export class LikesController {
    constructor( private likeSvc: LikesService ){}

    @Post('/new/:id')
    @UseGuards(AuthGuard())
    async postLike( @Res()res: Response, @Req()req: Request, @Param('id')pubId: any ){
        const user = <JwtPayload>req.user;
        const like = await this.likeSvc.postLike(pubId, user._id);
        return res.status(HttpStatus.OK).json(like);
    }
}

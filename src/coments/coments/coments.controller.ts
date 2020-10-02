import { Body, Controller, HttpStatus, Param, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { JwtPayload } from 'src/auth/interfaces/payload.interface';
import { comentDto } from '../dto/coment.dto';
import { ComentsService } from './coments.service';

@Controller('coments')
export class ComentsController {

    constructor( private comentSvc: ComentsService ){}

    @Post('/new/:id')
    @UseGuards(AuthGuard())
    async postComent( @Res()res: Response, @Req()req: Request, @Param('id')pubId: any, @Body()comentDto: comentDto ){
        const user = <JwtPayload>req.user;

        const coment = await this.comentSvc.postComent(user._id, comentDto, pubId);
        return res.status(HttpStatus.OK).json(coment);
    }
}

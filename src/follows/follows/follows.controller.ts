import { Controller, Post, UseGuards, Res, Param, Req, NotImplementedException, HttpStatus } from '@nestjs/common';
import { FollowsService } from './follows.service';
import { AuthGuard } from '@nestjs/passport';
import { JwtPayload } from 'src/auth/interfaces/payload.interface';

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
}

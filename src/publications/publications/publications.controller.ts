import { Controller, Post, UseGuards, Req, Res, Body, InternalServerErrorException, HttpException, HttpStatus, Get } from '@nestjs/common';
import { PublicationsService } from './publications.service';
import { AuthGuard } from '@nestjs/passport';
import { publicationDto } from '../publicationDto/publication.dto';
import { JwtPayload } from 'src/auth/interfaces/payload.interface';

@Controller('publications')
export class PublicationsController {

    constructor( private publicationSvc: PublicationsService ){}

    @Post('/new')
    @UseGuards(AuthGuard())
    async newPublication( @Res() res, @Body() publication: publicationDto, @Req() req: any ) {
        const _id = <JwtPayload>req.user._id
        console.log(_id);
        console.log(req.user);

        const newPub = await this.publicationSvc.createPublication(publication, _id);
        if(!newPub) throw new HttpException('error del servidor', HttpStatus.INTERNAL_SERVER_ERROR);

        return res.status(HttpStatus.OK).json({publication: newPub});
    }

    @Get('/')
    async getAll( @Res() res){
        const publications = await this.publicationSvc.getAllPublications();
        return res.status(HttpStatus.OK).json(publications);
    }
} 

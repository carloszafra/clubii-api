import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { comentDto } from '../dto/coment.dto';
import { comentI } from '../interface/coment.interface';

@Injectable()
export class ComentsService {

    constructor( @InjectModel('Coment') private comentModel: Model<comentI>){}

    async postComent( userId: string, pubId: string, comentDto: comentDto ): Promise<comentI> {

        try {
            const precoment = new this.comentModel(comentDto);
            precoment.user = userId;
            precoment.publication = pubId;
            const coment = await precoment.save();
            await coment.populate('user publication').execPopulate();
            return coment;
        } catch (error) {
            throw new HttpException('error al publicar comentario '+ error, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { comentDto } from '../dto/coment.dto';
import { comentI } from '../interface/coment.interface';

@Injectable()
export class ComentsService {

    constructor( @InjectModel('Coment') private comentModel: Model<comentI> ){}

    async postComent( userId: string, coment: comentDto, pubId: string): Promise<comentI> {
        
        try {
            const precoment = new this.comentModel(coment);
            precoment.publication = pubId;
            precoment.user = userId;
            const newcoment = await precoment.save();
            await newcoment.populate('user publication').execPopulate();
            return newcoment;
        } catch (error) {
            throw new HttpException('comentario no ejecutado', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}

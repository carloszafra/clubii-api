import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { publicationI } from '../interfaces/publication.interface';
import { userI } from 'src/users/users.interface/user.interface';
import { publicationDto } from '../publicationDto/publication.dto';

@Injectable()
export class PublicationsService {

    constructor( 
        @InjectModel('Publication') private publiModel: Model<publicationI>,
        @InjectModel('User') private userModel: Model<userI>
    ){}

    async createPublication( newPub: publicationDto, creatorId: any ): Promise<publicationI> {
        const publication = new this.publiModel(newPub);
        publication.creator = creatorId;
        const savedPub =  await publication.save();
        await savedPub.populate('creator').execPopulate();

        return savedPub;
    }

    async getAllPublications(): Promise<publicationI[]> {
        const publications = await this.publiModel.find().populate('creator', 'email username');
        return publications;
    }

    async getFollowedPublications(): Promise<publicationI> {
        return 
    }

    async getUserPublications( userId: string, page: number): Promise<any>{
        const publications = await Promise.all([
            this.publiModel.find({creator: userId})
             .skip(page).limit(5)
             .populate('creator', '_id name email username avatarUrl'),
            
            this.publiModel.countDocuments({creator: userId})
        ]);

        return publications;
    }
} 

import { Injectable, NotFoundException, MethodNotAllowedException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { userI } from '../users.interface/user.interface';
import { userDto } from '../users.dto/user.dto';
import { loguserDto } from '../users.dto/loguser.dto';

@Injectable()
export class UserService {

    constructor( @InjectModel('User') private userModel: Model<userI> ){}

    async createUser( user: userDto ): Promise<userI> {
       const newUser = new this.userModel(user);
       newUser.avatarUrl, newUser.coverUrl = null;
       newUser.password = await newUser.hashPassword( newUser.password );
       const savedUser= await newUser.save();
       return savedUser;
    }

    async loginUser( logedUser: loguserDto ): Promise<userI> {
       const user = await this.userModel.findOne({email: logedUser.email});
       if(!user) throw new NotFoundException('no user found');

       const correctPassword = user.comparePasswords( logedUser.password );
       if(!correctPassword) throw new MethodNotAllowedException('not authorized');

       return user;
    }

    async findByEmail( email: string ): Promise<userI> {
        const user = await this.userModel.findOne({email: email});
        return user;
    }

    async findById( userId: string ): Promise<userI> {
        const user = await this.userModel.findOne({_id: userId})
        return user;
    }

    async findByPayload( {_id}: any ):Promise<userI> {
        const user = await this.userModel.findOne({_id: _id});
        return user;
    }

    async updateUser(userDto: userDto, id: string): Promise<userI> {
        const user = await this.userModel.findByIdAndUpdate(id, userDto, {new: true});
        return user;
    }

    async deleteUser(id: string){
       const userDeleted = await this.userModel.findOneAndDelete({_id:id});
       return userDeleted;
    }

    async uploadAvatar(userId: string, avatarUrl: string): Promise<userI> {
        console.log(`userId: ${userId}, filename: ${avatarUrl}`);
        const user = await this.userModel.findByIdAndUpdate(userId, {avatarUrl: avatarUrl}, {new: true});
        return user;
    }

    async uploadCover( userId: string, coverUrl: string ): Promise<userI> {
        const user = await this.userModel.findByIdAndUpdate(userId, {coverUrl: coverUrl}, {new: true});
        return user;
    }
}

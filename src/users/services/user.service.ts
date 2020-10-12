import { Injectable, NotFoundException, MethodNotAllowedException, HttpException, HttpStatus } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { userI } from '../users.interface/user.interface';
import { userDto } from '../users.dto/user.dto';
import { loguserDto } from '../users.dto/loguser.dto';

@Injectable()
export class UserService {

    constructor( @InjectModel('User') private userModel: Model<userI> ){}

    async createUser( user: userDto ): Promise<userI> {
      try{
        const emailExists = await this.userModel.findOne({email: user.email});
        if(emailExists) throw new HttpException('el correo ya existe', HttpStatus.NOT_ACCEPTABLE);

        const newUser: userI = new this.userModel(user);
            newUser.password = await newUser.hashPassword( newUser.password );
            newUser.avatarUrl = null;
            const savedUser = await newUser.save();
            return savedUser;
      }catch(error){
        throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }

    async loginUser( logedUser: loguserDto ): Promise<userI> {
       const user = await this.userModel.findOne({email: logedUser.email});
       if(!user) throw new NotFoundException('no user found');

       const correctPassword = user.comparePasswords( logedUser.password );
       if(!correctPassword) throw new MethodNotAllowedException('not authorized');

       console.log(user);

       return user;
    }

    async findByEmail( email: string ): Promise<userI> {
        const user = await this.userModel.findOne({email: email}, 'name email avatarUrl coverUrl timestamp ');
        return user;
    }

    async findById( userId: string ): Promise<userI> {
        try{
            const user = await this.userModel.findOne({_id: userId})
            console.log(user)
            return user;
        }catch(error){
           throw new HttpException(`error: ${error}`, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async findByPayload( {_id}: any ):Promise<userI> {
        const user = await this.userModel.findOne({_id: _id});
        return user;
    }

    async updateUser(userDto: userDto, id: string): Promise<userI> {
        const user = await this.userModel
        .findByIdAndUpdate(id, userDto, {new: true, select: 'name email avatarUrl coverUrl timestamp'});
        return user;
    }

    async deleteUser(id: string){
       const userDeleted = await this.userModel.findOneAndDelete({_id:id});
       return userDeleted;
    }

    async getUsers( page: number ): Promise<any> {
       const users = await Promise.all([
           this.userModel.find({}, 'name email username avatarUrl country description coverUrl').skip(page).limit(5),
           this.userModel.countDocuments()
       ]);

       return users;
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

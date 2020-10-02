import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { UserService } from '../users/services/user.service';
import { JwtService } from '@nestjs/jwt';
import { userDto } from 'src/users/users.dto/user.dto';
import { RegistrationStatus } from './interfaces/registration.interface';
import { loguserDto } from 'src/users/users.dto/loguser.dto';
import { userI } from 'src/users/users.interface/user.interface';
import { JwtPayload } from './interfaces/payload.interface';

@Injectable()
export class AuthService {

    constructor(
        private userSvc: UserService,
        private jwtSvc: JwtService
    ){}

    async register( user: userDto):Promise<RegistrationStatus> {
        let status: RegistrationStatus = {
            success: true,
            message: 'user registered'
        };
        try{
            const newUser = await this.userSvc.createUser( user );
        }catch(err){
            status = {
                success: false,
                message: err
            }
        }

        return status;
    }

    async login( user: loguserDto ): Promise<any>{
       const userLoged = await this.userSvc.loginUser( user );
       console.log(userLoged);

       const identity = {
           _id: userLoged._id,
           email: userLoged.email,
           username: userLoged.username,
           coverUrl: userLoged.coverUrl,
           avatarUrl: userLoged.avatarUrl,
           timestamp: userLoged.timestamp
        }

       const token = this.createToken( userLoged._id );
       return { user: identity, ...token };
    }

    private createToken({_id}: userI): any {
       console.log(_id); 
       const user: JwtPayload = {_id};
       const accessToken = this.jwtSvc.sign(user);

       return {
           expiresIn: process.env.EXPIRES_IN,
           token: accessToken
       }
    }

    async validateUser( payload: JwtPayload ): Promise<userI> {
       const user = this.userSvc.findByPayload( payload );
       if(!user) throw new HttpException('not found', HttpStatus.UNAUTHORIZED);

       return user;
    }
}

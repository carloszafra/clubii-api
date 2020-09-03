import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { userI } from '../users/users.interface/user.interface';
import { JwtPayload } from './interfaces/payload.interface';

@Injectable() 
export class JwtStrategy extends PassportStrategy(Strategy){

    constructor( private authSvc: AuthService){

        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.SECRET_KEY
        })
    }

    async validate( payload: JwtPayload ):Promise<userI> {
       const user = this.authSvc.validateUser( payload );
       if(!user) throw new HttpException('invalid token', HttpStatus.UNAUTHORIZED);

       return user;
    }
}
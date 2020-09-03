import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { userDto } from 'src/users/users.dto/user.dto';
import { RegistrationStatus } from './interfaces/registration.interface';
import { loguserDto } from 'src/users/users.dto/loguser.dto';
import { userI } from 'src/users/users.interface/user.interface';

@Controller('auth')
export class AuthController {

    constructor( private authSvc: AuthService ){}

    @Post('/regsiter')
    public async register( @Body() user: userDto): Promise<RegistrationStatus>{
        const result: RegistrationStatus = await this.authSvc.register( user );
        if(!result.success) throw new HttpException( result.message, HttpStatus.BAD_REQUEST);

        return result;
    }

    @Post('/login')
    public async login( @Body() user: loguserDto): Promise<any> {
        const userLoged = await this.authSvc.login( user );
        if(!userLoged) throw new HttpException('password or email incorrect', HttpStatus.BAD_REQUEST);

        return userLoged;
    }
}

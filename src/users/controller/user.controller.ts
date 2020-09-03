import { Controller, Post, Get, UseGuards, Res, Req, HttpStatus, Body, Param, NotAcceptableException, NotImplementedException, NotFoundException, UseInterceptors, UploadedFile, HttpException } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { AuthGuard } from '@nestjs/passport';
import { JwtPayload } from 'src/auth/interfaces/payload.interface';
import { userDto } from '../users.dto/user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { editFileName, imageFileFilter } from 'src/utils/file-upload.utils';
import { fileURLToPath } from 'url';

@Controller('user')
export class UserController {

    constructor( private userSvc: UserService ){}

    @Get('/prueba')
    @UseGuards(AuthGuard())
    async prueba( @Res() res, @Req() req: any){
        const user = <JwtPayload>req.user;
        console.log(`user: ${user}`);

        return res.status(HttpStatus.OK).json({user: user});
    }

    @Post('/edit/:id')
    @UseGuards(AuthGuard())
    async editUser( @Res() res, @Body()user: userDto, @Param('id') userId: any, @Req() req: any){ 
        if(userId != req.user._id) throw new NotAcceptableException(HttpStatus.UNAUTHORIZED, 'no autorizado');

        const userUpdated = await this.userSvc.updateUser(user, userId);
        if(!userUpdated) throw new NotImplementedException(HttpStatus.NOT_IMPLEMENTED, 'los cambios no se guardaron');

        return res.status(HttpStatus.OK).json({user: userUpdated});
    }

    @Get('/:id')
    async getUser( @Res() res, @Param('id') userId: string){
        const user = this.userSvc.findById(userId);
        if(!user) throw new NotFoundException;

        return res.status(HttpStatus.OK).json({user});
    }

    @Post('avatar/:id')
    @UseGuards(AuthGuard())
    @UseInterceptors(FileInterceptor('image', {
        storage: diskStorage({
            destination: './avatars',
            filename: editFileName,
        }),
        fileFilter: imageFileFilter
    }),
    )
    async uploadImage( @Req() req: any, @Res() res, @UploadedFile() file, @Param('id')userId: any ){
        console.log(file);
        const user = <JwtPayload>req.user;
        const userUpdated = await this.userSvc.uploadAvatar(user._id, file.filename);
        if(!userUpdated) throw new HttpException('error', HttpStatus.BAD_REQUEST);

        return res.status(HttpStatus.OK).json(userUpdated);
    }

    @Post('cover/:id')
    @UseGuards(AuthGuard())
    @UseInterceptors(FileInterceptor('image', {
        storage: diskStorage({
            destination: './covers',
            filename: editFileName,
        }),
        fileFilter: imageFileFilter
    }),
    )
    async uploadCover( @Req() req: any, @Res() res, @UploadedFile() file, @Param('id') userId: any){
        const user = <JwtPayload>req.user;
        if(user._id != userId) throw new NotAcceptableException(HttpStatus.UNAUTHORIZED, 'no autorizado');
        
        const userUpdated = await this.userSvc.uploadCover(user._id, file.filename);
        if(!userUpdated) throw new HttpException('error', HttpStatus.BAD_REQUEST);

        return res.status(HttpStatus.OK).json(userUpdated);
    }

}
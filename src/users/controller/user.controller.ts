import { Controller, Post, Put, Get, UseGuards, Res, Req, HttpStatus, Body, Param, NotAcceptableException, NotImplementedException, NotFoundException, UseInterceptors, UploadedFile, HttpException, Delete, Query } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { AuthGuard } from '@nestjs/passport';
import { JwtPayload } from 'src/auth/interfaces/payload.interface';
import { userDto } from '../users.dto/user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { editFileName, imageFileFilter } from 'src/utils/file-upload.utils';
import { Request, Response } from 'express';


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

    @Get('/')
    @UseGuards(AuthGuard())
    async getUsers(@Res() res: Response, @Query('from') from: any){
        
        const page = from ? Number(from) : 0;

        const [users, total] = await this.userSvc.getUsers(page);

        return res.status(HttpStatus.OK).json({users, total});
    }

    @Get('/logged')
    @UseGuards(AuthGuard())
    async getLoggedUser( @Res() res: Response, @Req() req: Request){
        const user = <JwtPayload>req.user;
        const logeduser = await this.userSvc.findById(user._id);

        const userloged = {
            name: logeduser.name,
            description: logeduser.description,
            username: logeduser.username,
            birthday: logeduser.birthday,
            country: logeduser.country,
            email: logeduser.email,
            avatarUrl: logeduser.avatarUrl,
            twitter: logeduser.twitter,
            instagram: logeduser.instagram,
            coverUrl: logeduser.instagram
        }

        return res.status(HttpStatus.OK).json(userloged);
    }

    @Put('/edit/:id')
    @UseGuards(AuthGuard())
    async editUser( @Res() res, @Body()user: userDto, @Param('id') userId: any, @Req() req: any){ 
        if(userId != req.user._id) throw new NotAcceptableException(HttpStatus.UNAUTHORIZED, 'no autorizado');

        const userUpdated = await this.userSvc.updateUser(user, userId);
        if(!userUpdated) throw new NotImplementedException(HttpStatus.NOT_IMPLEMENTED, 'los cambios no se guardaron');

        return res.status(HttpStatus.OK).json({user: userUpdated});
    }

    @Get('/:id')
    @UseGuards(AuthGuard()) 
    async getUser( @Res() res, @Param('id') userId: string){
        console.log(userId)
        const user = await this.userSvc.findById(userId);
        if(!user) throw new NotFoundException;

        return res.status(HttpStatus.OK).json({user: user});
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

    @Delete('/:id')
    @UseGuards(AuthGuard())
    async deleteUser( @Res() res, @Param('id') userId, @Req() req:any){
        const user = <JwtPayload>req.user;
        if(user._id != userId) throw new NotAcceptableException(HttpStatus.UNAUTHORIZED, 'no autorizado');

        const userDeleted = await this.userSvc.deleteUser(user._id);
        if(!userDeleted) throw new HttpException('error al eliminar', HttpStatus.BAD_REQUEST);

        return res.status(HttpStatus.OK).json({message: 'user deleted'});
    }

}

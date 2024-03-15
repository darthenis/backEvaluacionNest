import { Body, Controller, Get, Param, Patch, Post, Put, UseGuards } from '@nestjs/common';
import { UserService } from './services/user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { AdminGuard } from './guards/admin.guard';
import { AuthGuard } from './guards/auth.guard';
import { ChangeRolDto } from './dto/change-rol.dto';
import { EditUserDto } from './dto/edit-user.dto';

@Controller('auth')
export class AuthController {

    constructor(private readonly userService: UserService){}
    
    @Post("/register")
    register(@Body() createUserDto: CreateUserDto){
        return this.userService.register(createUserDto);
    }

    @Post("/login")
    login(@Body() loginUserDto: LoginUserDto){
        return this.userService.login(loginUserDto);
    }

    @UseGuards( AdminGuard )
    @Patch("/rol/:id")
    changeRol(@Param("id") id: string, @Body() changeRolDto : ChangeRolDto){
        return this.userService.changeRol(id, changeRolDto);
    }

    @UseGuards( AuthGuard )
    @Patch("/profile")
    updateUser(@Body() editUserDto: EditUserDto){
        return this.userService.editUser(editUserDto);
    }

    @UseGuards( AuthGuard )
    @Get("check-token")
    checkToken(){
        return this.userService.checkToken();
    }


    @UseGuards( AuthGuard )
    @Post("/public-info")
    getPublicInfo(@Body() ids: string[]){
        return this.userService.getPublicInfo(ids);
    }


}

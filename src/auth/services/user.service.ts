import { BadRequestException, HttpException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException }from '@nestjs/common';
import { InjectModel  } from '@nestjs/mongoose';
import mongoose, { Document, Model } from 'mongoose';
import { CreateUserDto } from 'src/auth/dto/create-user.dto';
import { User } from 'src/auth/entities/user.entity';
import * as bcryptjs from 'bcryptjs';
import { RegisterUserDto } from 'src/auth/dto/register-user.dto';
import { LoginResponse } from 'src/auth/interfaces/login-response';
import { LoginUserDto } from 'src/auth/dto/login-user.dto';
import { JwtUtilsService } from '../jwt/jwt.service';
import { ChangeRolDto } from '../dto/change-rol.dto';
import { EditUserDto } from '../dto/edit-user.dto';
import { PublicInfoUser } from '../interfaces/user-public.interface';

@Injectable()
export class UserService {

    constructor(@InjectModel(User.name)
                private userModel : Model<User>,
                private jwtUtilsService : JwtUtilsService){}

    async create(createUserDto : CreateUserDto):Promise<User>{
        try {
            
            const { password, ...userData } = createUserDto;

            const newUser = new this.userModel({
                password: bcryptjs.hashSync(password, 10),
                ...userData
            })

            await newUser.save();

            const { password:_, ...user} = newUser.toJSON();

            return user;

        } catch (error) {

            if(error.code === 11000){
                throw new HttpException('Email already exists', HttpStatus.CONFLICT);
            }

            throw new InternalServerErrorException("Something was wrong")
        }
    }

    async getRol(id: string){
        return (await this.userModel.findById(id)).role;
    }

    async register(registerUserDto: RegisterUserDto): Promise<LoginResponse>{
            const user = await this.create(registerUserDto);

            return {
                user,
                token: this.jwtUtilsService.createJwt(user._id)
            }
    }


    async login(loginUserDto : LoginUserDto): Promise<LoginResponse>{

        const { email, password } = loginUserDto;

        const user = await this.userModel.findOne({ email }).lean();

        if(!user) throw new UnauthorizedException("Not valid credentials");

        if( !bcryptjs.compareSync( password, user.password )) throw new UnauthorizedException("Not valid credentials")

        const { password:_, ...rest } = user;

        return{
            user : rest,
            token: this.jwtUtilsService.createJwt(user._id)
        }

    }

    async findUserById(id : string){
        const user = await this.userModel.findById(id).lean();
        const { password, ...rest } = user;
        return rest;
    }

    async userExistsById(id: string):Promise<boolean>{
        const user = await this.userModel.findById(id);

        if(user) return true;

        return false;
    }

    async changeRol(id: string, changeRolDto: ChangeRolDto){
        console.log(changeRolDto)
        try {
            const user = await this.userModel.findById(id);

            if(!user) throw new NotFoundException();
        
            user.role = changeRolDto.role;

            await user.save();
            const { password:_, ...rest } = user;
            return rest;

        } catch (error) {
            return error;
        }
   
    }

    async editUser(editUserDto: EditUserDto){

        const userId = await this.jwtUtilsService.getId();

        const user : Document<User> = await this.userModel.findById(userId)

        user.set(editUserDto)

        await user.save()
        
        const { password, ...rest } = user.toObject();
        
        return rest;
                
    }

    async checkToken(){

        const userId = await this.jwtUtilsService.getId();

        const user : Document<User> = await this.userModel.findById(userId)

        const { password, ...rest } = user.toObject();

        return {
            user: rest,
            token: this.jwtUtilsService.createJwt(userId)
        }

    }

    async getPublicInfo(ids : string[]):Promise<PublicInfoUser[]>{
        console.log(ids)
      

        return await this.userModel.find({ '_id': { $in: ids } }).select(["name", "profileUrl"])

    }

}

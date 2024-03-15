import { IsDateString, IsEmail, IsOptional, IsString, IsUrl, MinLength } from "class-validator";

class Address{
    @IsString()
    street: string;

    @IsString()
    location : string;

    @IsString()
    city: string;

    @IsString()
    country: string;

    @IsString()
    cp: string;
}

export class RegisterUserDto {
        @MinLength(2) 
        name:     string;
       
        @MinLength(8)
        password: string;

        @IsEmail()
        email:     string;

        address:  Address;
    
        @IsDateString()
        birthday: Date;

        @IsString()
        phone:    string;

        @IsOptional()
        @IsUrl()    
        profileUrl: string

}
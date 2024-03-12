import { Type } from "class-transformer";
import { IsEmail, IsString, MinLength, ValidateNested } from "class-validator";

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

export class CreateUserDto {
        @MinLength(2) 
        name:     string;
       
        @MinLength(8)
        password: string;

        @IsEmail()
        email:     string;
        
        @ValidateNested()
        @Type(() => Address)
        address:  Address;
    
        birthday: string;

        phone:    string;

        date:     string;
}
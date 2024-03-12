import { IsEmail, MinLength } from "class-validator";


export class RegisterUserDto {
        @MinLength(2) 
        name:     string;
       
        @MinLength(8)
        password: string;

        @IsEmail()
        email:     string;

        address:  Address;
    
        birthday: string;

        phone:    string;

        date:     string;
}

class Address{

    street:   string;

    location: string;

    city:     string;

    country:  string;

    cp:       string;
}
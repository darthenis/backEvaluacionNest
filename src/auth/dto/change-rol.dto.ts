import { Rol } from "../interfaces/rol.enum";
import { IsEnum } from "class-validator";


export class ChangeRolDto {

    @IsEnum(Rol)
    rol : Rol;

}
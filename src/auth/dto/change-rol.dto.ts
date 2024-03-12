import { Role } from "../interfaces/role.enum";
import { IsEnum } from "class-validator";


export class ChangeRolDto {

    @IsEnum(Role)
    role : Role;

}
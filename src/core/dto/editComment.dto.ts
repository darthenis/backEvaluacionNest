import { IsString } from "class-validator";


export class EditCommentDto{

    @IsString()
    message : string;
    
}
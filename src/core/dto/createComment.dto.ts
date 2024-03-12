import { IsString } from "class-validator";


export class CreateCommentDto {

    @IsString()
    episodeId : string;

    @IsString()
    message : string;

}
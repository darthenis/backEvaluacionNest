import { IsString } from "class-validator";


export class CreateFavoriteEpisodeDto{

    @IsString()
    episodeId: string;

    @IsString()
    name : string;

}
import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FavoriteEpisode } from '../entities/favorite-episode.entity';
import { Model } from 'mongoose';
import { CreateFavoriteEpisodeDto } from '../dto/createFavoriteEpisode.dto';
import { JwtUtilsService } from 'src/auth/jwt/jwt.service';
import { UserService } from 'src/auth/services/user.service';

@Injectable()
export class FavoriteService {

    constructor(@InjectModel(FavoriteEpisode.name)
                private favoriteModel : Model<FavoriteEpisode>,
                private jwtUtilsService : JwtUtilsService,
                private userService : UserService
                ){}

    async getFavorites(){
        const userId = await this.jwtUtilsService.getId();

        const favorites = await this.favoriteModel.find({userId});

        return favorites;
    }

    async addFavorite(createFavoriteEpisodeDto: CreateFavoriteEpisodeDto):Promise<FavoriteEpisode>{
        
        try {
            const userId = await this.jwtUtilsService.getId();

            const existsUser = await this.userService.userExistsById(userId);

            if(!existsUser) throw new NotFoundException();

            const existsFavorite = await this.existsEpisodeFavorite(createFavoriteEpisodeDto.episodeId, userId);

            if(existsFavorite) throw new BadRequestException();

            const newFavorite = await this.favoriteModel.create({
                                            userId,
                                            episode: {
                                                id: createFavoriteEpisodeDto.episodeId,
                                                name: createFavoriteEpisodeDto.name,
                                            },
                                        })

            await newFavorite.save();

            return newFavorite;
        } catch (error) {
            return error;
        }

            
    }

    private async existsEpisodeFavorite(episodeId : string, userId: string):Promise<boolean>{
            const episodeFavorite = await this.favoriteModel.find({episode: { id: episodeId }})
        
            if(!episodeFavorite) return false;

            if(episodeFavorite.find( e => e.userId === userId)) return true;

            return false;

    }

    async deleteFavorite(id:string){
        try {
            const favorite = await this.favoriteModel.findById(id);

            if(!favorite) throw new NotFoundException();
    
            const userId = await this.jwtUtilsService.getId();
    
            if(favorite.userId !== userId) throw new UnauthorizedException();
    
            await favorite.deleteOne()

        } catch (error) {
            return error;
        }
   
    }

}

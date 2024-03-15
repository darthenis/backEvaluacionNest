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

            if(!existsUser) throw new NotFoundException("Not found user");

            const existsFavorite = await this.existsEpisodeFavorite(createFavoriteEpisodeDto.episodeId, userId);

            if(existsFavorite) throw new BadRequestException("Favorite already exists");

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

            throw error;
        }

            
    }

    private async existsEpisodeFavorite(episodeId : string, userId: string):Promise<boolean>{
            const episodeFavorite = await this.favoriteModel.find({userId})
        
            if(!episodeFavorite.length) return false;

            if(episodeFavorite.find( e => e.episode.id === episodeId)) return true;

            return false;

    }

    async deleteFavorite(id:string){
        try {
    
            const userId = await this.jwtUtilsService.getId();

            const favorites = await this.favoriteModel.find({userId});

            const favorite = favorites.find(f => f.episode.id === id);

            if(!favorites.length || !favorite) throw new NotFoundException();
    
            await favorite.deleteOne()

            return favorites.filter(f => f.episode.id !== id);

        } catch (error) {
            
            throw error;
        }
   
    }

}

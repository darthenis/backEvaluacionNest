import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { CreateFavoriteEpisodeDto } from 'src/core/dto/createFavoriteEpisode.dto';
import { FavoriteService } from 'src/core/services/favorite.service';

@UseGuards(AuthGuard)
@Controller('favorite-episode')
export class FavoriteEpisodeController {

    constructor(private FavoriteService : FavoriteService){}

    @Post()
    createFavorite(@Body() createFavoriteDto: CreateFavoriteEpisodeDto){
            return this.FavoriteService.addFavorite(createFavoriteDto);
    }

    @Get()
    getFavorites(){
        return this.FavoriteService.getFavorites();
    }

    @Delete(":id")
    deleteFavorite(@Param("id") id: string){
        return this.FavoriteService.deleteFavorite(id);
    }

}

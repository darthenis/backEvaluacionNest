import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";


@Schema()
class Episode {

    @Prop({required:true})
    id: string;

    @Prop({required:true})
    name: string;

}

const episodeSchema = SchemaFactory.createForClass(Episode)


@Schema()
export class FavoriteEpisode{

    _id? : string
    
    @Prop({required:true})
    userId : string;

    @Prop({type: episodeSchema, required:true})
    episode : Episode;

}

export const FavoriteEpisodeSchema = SchemaFactory.createForClass(FavoriteEpisode);
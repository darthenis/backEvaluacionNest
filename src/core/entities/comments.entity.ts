import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";


@Schema({_id: false})
class Author {
    @Prop({required: true})
    name: string;

    @Prop({required: true})
    userId: string;
    
    @Prop({required: true})
    rol: string;
}

const AuthorSchema = SchemaFactory.createForClass(Author)

@Schema()
export class Comment {
    
    _id?:string;

    @Prop({required: true})
    episodeId: string;

    @Prop({required: true})
    message : string;

    @Prop({ type: AuthorSchema, required: true })
    author : Author;

    @Prop({required: true})
    creationDate : Date;

}


export const CommentSchema = SchemaFactory.createForClass(Comment)
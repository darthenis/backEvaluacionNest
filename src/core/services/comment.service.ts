import { Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Comment } from '../entities/comments.entity';
import { Model } from 'mongoose';
import { CreateCommentDto } from '../dto/createComment.dto';
import { JwtUtilsService } from 'src/auth/jwt/jwt.service';
import { UserService } from 'src/auth/services/user.service';
import { EditCommentDto } from '../dto/editComment.dto';
import { Role } from 'src/auth/interfaces/role.enum';

@Injectable()
export class CommentService {

    constructor(@InjectModel(Comment.name)
                private commentModel : Model<Comment>,
                private jwtUtilsService : JwtUtilsService,
                private userService: UserService ){}

    async create( creationCommentDto: CreateCommentDto ):Promise<Comment>{
        
        try {
            
            const id = await this.jwtUtilsService.getId();

            const user = await this.userService.findUserById(id);
    
            if(!user) throw new UnauthorizedException("user not found")
    
            const newComment = await this.commentModel.create({
                episodeId: creationCommentDto.episodeId,
                message: creationCommentDto.message,
                author:{
                    name: user.name,
                    userId: user._id,
                    rol: user.role
                },
                creationDate: new Date(),
            })

            await newComment.save();

            return newComment;

        } catch (error) {
            throw new UnauthorizedException(error.message)   
        }

    }

    getCommentsByEpisodeId(episodeId: string):Promise<Comment[]>{
        return this.commentModel.find({episodeId})
    }

    async editComment(id: string, editCommentsDto: EditCommentDto):Promise<Comment>{
           
            try {

                const comment = await this.commentModel.findById(id);

                if(!comment) throw new NotFoundException("Comment not found");
    
                const userId = await this.jwtUtilsService.getId()
    
                const exists = await this.userService.userExistsById(userId);
    
                if(!exists) throw new UnauthorizedException();

                const role = await this.userService.getRol(userId);
    
                if(comment.author.userId !== userId && role !== Role.ADMIN) throw new UnauthorizedException();

                comment.set(editCommentsDto);

                await comment.save();

                return comment;

            } catch (error) {
                
                throw new InternalServerErrorException();
            }
            
    }

    async deleteComment(id:string){

        try {

            const comment = await this.commentModel.findById(id);

            if(!comment) throw new NotFoundException();
    
            const userId = await this.jwtUtilsService.getId()
    
            const exists = await this.userService.userExistsById(userId);
    
            if(!exists) throw new UnauthorizedException();

            const role = await this.userService.getRol(userId);
    
            if( comment.author.userId !== userId && role !== Role.ADMIN ) throw new UnauthorizedException();

            await comment.deleteOne();

        } catch (error) {

            throw error;
        }

    }

    async switchActive(id: string){

        const comment = await this.commentModel.findById(id);

        if(!comment) throw new NotFoundException();
        
        comment.active = !comment.active;

        await comment.save();

        return comment.toObject();

    }

}

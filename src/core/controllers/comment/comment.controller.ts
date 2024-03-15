import { Body, Controller, Delete, Get, Param, Patch, Post, Put, UseGuards } from '@nestjs/common';
import { AdminGuard } from 'src/auth/guards/admin.guard';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { CreateCommentDto } from 'src/core/dto/createComment.dto';
import { EditCommentDto } from 'src/core/dto/editComment.dto';
import { CommentService } from 'src/core/services/comment.service';

@UseGuards( AuthGuard )
@Controller('comment')
export class CommentController {

    constructor(private commentService : CommentService){}

    @Post()
    create( @Body() createCommentDto: CreateCommentDto ){
            return this.commentService.create(createCommentDto);
    }

    @Get(":id")
    getComments(@Param('id') id: string){
        return this.commentService.getCommentsByEpisodeId(id);
    }

    @Patch(":id")
    editComments(@Param("id") id: string, @Body() editCommentsDto: EditCommentDto){
        return this.commentService.editComment(id, editCommentsDto)
    }

    @Delete(":id")
    deleteComment(@Param("id") id: string){
        return this.commentService.deleteComment(id)
    }

    @UseGuards( AdminGuard )
    @Get("/active/:id")
    switchActive(@Param("id") id: string){
        return this.commentService.switchActive(id);
    }

}

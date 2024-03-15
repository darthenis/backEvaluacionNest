import { Module } from '@nestjs/common';
import { CommentService } from './services/comment.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { CommentSchema } from './entities/comments.entity';
import { AuthModule } from 'src/auth/auth.module';
import { CommentController } from './controllers/comment/comment.controller';
import { FavoriteService } from './services/favorite.service';
import { FavoriteEpisodeController } from './controllers/favorite-episode/favorite-episode.controller';
import { FavoriteEpisodeSchema } from './entities/favorite-episode.entity';

@Module({
  providers: [CommentService, FavoriteService],
  imports: [
    ConfigModule.forRoot(),
    AuthModule,
    MongooseModule.forFeature([
      { name: "Comment", schema: CommentSchema },
      { name: "FavoriteEpisode", schema: FavoriteEpisodeSchema }
    ])
  ],
  controllers: [CommentController, FavoriteEpisodeController]
})
export class CoreModule {}

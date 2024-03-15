import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { userSchema } from './entities/user.entity';
import { ConfigModule } from '@nestjs/config';
import { UserService } from './services/user.service';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { JwtUtilsService } from './jwt/jwt.service';


@Module({
  controllers: [ AuthController ],
  imports:[
    ConfigModule.forRoot(),
    MongooseModule.forFeature([{ name: "User", schema: userSchema }]),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SEED,
      signOptions: {expiresIn: "1h"}
    })
  ],
  providers: [UserService, JwtUtilsService ],
  exports: [UserService, JwtUtilsService ]
})
export class AuthModule {}

import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { JwtUtilsService } from '../jwt/jwt.service';

@Injectable()
export class AuthGuard implements CanActivate {
U
  constructor(  @Inject(JwtUtilsService)
                private jwtUtilsService : JwtUtilsService,
                @Inject(UserService)
                private userService : UserService ){}

  async canActivate( context: ExecutionContext ): Promise<boolean> {

          const id = await this.jwtUtilsService.getId()

          const userExists = await this.userService.userExistsById(id);
          
          if(!userExists) throw new UnauthorizedException("User not found");

          return Promise.resolve(true);

  }


}

import { CanActivate, ExecutionContext, Inject } from "@nestjs/common";
import { JwtUtilsService } from "../jwt/jwt.service";
import { UserService } from "../services/user.service";
import { Role } from "../interfaces/role.enum";


export class AdminGuard implements CanActivate{

    constructor(@Inject(JwtUtilsService) 
                private jwtUtilsService : JwtUtilsService,
                @Inject(UserService)
                private userService : UserService,
                    ){}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        
        const userId = await this.jwtUtilsService.getId();

        const role = await this.userService.getRol(userId);

        if(role === Role.ADMIN) return Promise.resolve(true);

        return Promise.resolve(false);
    }
    
}
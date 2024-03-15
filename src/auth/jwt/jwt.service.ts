import { Inject, Injectable, Scope, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { JwtPayload } from "../interfaces/JwtPayload.interface";
import { REQUEST } from "@nestjs/core";
import { Request } from "express";

@Injectable({ scope: Scope.REQUEST })
export class JwtUtilsService {

  constructor(@Inject(REQUEST)
              private readonly request : Request,
              private jwtService: JwtService ){}


  createJwt(id : string){
                return this.jwtService.sign({id});
            }

  async getId():Promise<string>{

        try {

            const token = this.extractTokenFromHeader();

            const payload = await this.getPayload(token)
    
            return payload.id;
            
        } catch (error) {
            throw new UnauthorizedException(error.message)
        }

  }


  private extractTokenFromHeader():string | undefined {
    const [ type, token ] = this.request.headers['authorization']?.split(' ') ?? [];
    
    if(!token || type !== "Bearer") throw new UnauthorizedException("Wrong token");
    
    return token;
  } 

  async getPayload(token : string){
    return await this.jwtService.verifyAsync<JwtPayload>(
      token, { secret: process.env.JWT_SEED }
  )
  }

}

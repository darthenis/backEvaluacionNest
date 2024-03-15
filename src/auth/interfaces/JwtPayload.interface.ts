export interface JwtPayload{
    id: string,
    rol: string,
    iat?: number,
    exp?: number,
}
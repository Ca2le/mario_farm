import { Model } from "mongoose";
import { Request } from "express";

export type PokemonType = "normal" | "fire" | "water" | "grass" | "electric" | "ice" | "fighting" | "poison" | "ground" | "flying" | "psychic" | "bug" | "rock" | "ghost" | "dragon" | "dark" | "fairy" | "steel";

export interface IPokemon {
    id: string,
    name: string,
    type: PokemonType[],
    effective: PokemonType[],
    weakness: PokemonType[],
    min_power: number,
    max_power: number,
    img: string,
    rare: boolean,
    createdAt: Date,
    location:any
}

export interface IUserAuth {
    name: string,
    email: string,
    password: string,
    role: Role,
    passwordUpdated: number,
    confirmPassword: string,
    newPW_Token: string,
    newPW_TokenExp: number,
    newPW_Pending: boolean
}

export interface IUserMethods {
    isPasswordOlderThenToken(token: JWTInterface): boolean,
    createCryptoToken(): string
}

export type UserModel = Model<IUserAuth, {}, IUserMethods>

export type Role = "ADMIN" | "PROUSER" | "USER"

export enum httpStatus {
    OK = 200,
    CREATED = 201,
    NO_CONTENT = 204,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    METHOD_NOT_ALLOWED = 405,
    CONFLICT = 409,
    INTERNAL_SERVER_ERROR = 500,
    SERVICE_UNAVAILABLE = 503,
}

export interface JWTInterface {
    id: string,
    iat: number,
    exp: number
}
export interface CustomRequest extends Request {
    user: IUserAuth
}

export interface IMail {
    from: "noreplay@jumpcode.org",
    to: string,
    subject: string,
    text: string,
    html: string,
    attachments: any[]
}
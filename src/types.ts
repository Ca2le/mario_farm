import { Document } from "mongoose";

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
    createdAt: Date
}

export interface IUser extends Document {
    name: string,
    email: string,
    password: string,
    confirmPassword: string,
    avatar: string
}
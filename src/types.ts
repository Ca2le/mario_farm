export type PokemonType = "Normal" | "Fire" | "Water" | "Grass" | "Electric" | "Ice" | "Fighting" | "Poison" | "Ground" | "Flying" | "Psychic" | "Bug" | "Rock" | "Ghost" | "Dragon" | "Dark" | "Fairy" | "Steel";

export interface IPokemon {
    id: string,
    name: string,
    type: PokemonType[],
    effective: PokemonType[],
    weakness: PokemonType[],
    min_power: number,
    max_power: number,
    img: string,
    createdAt: Date
}
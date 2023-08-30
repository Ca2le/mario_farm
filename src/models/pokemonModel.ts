import mongoose, { Model } from "mongoose";
import { IPokemon } from "../types";

const pokemonSchema = new mongoose.Schema<IPokemon, Model<IPokemon>>({
    id: {
        type: String,
        required: [true, "A pokemon needs a ID."],
        unique: true
    },
    name: {
        type: String,
        required: [true, "A name is required for a pokemon."],
        unique: true
    },
    type: {
        type: [String],
        required: [true, "A pokemon needs a type."],
    },
    effective: {
        type: [String],
    },
    weakness: [String],
    min_power: {
        type: Number,
        required: [true, "A pokemon needs a minimum power range."],
    },
    max_power: {
        type: Number,
        required: [true, "A pokemon needs a maximum power range."],
    },
    img: {
        type: String,
        required: [true, "A pokemon needs a pretty image."],
        unique: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

export const Pokemon = mongoose.model('Pokemon', pokemonSchema)


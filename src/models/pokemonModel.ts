import mongoose, { Model, Query, Schema } from "mongoose";
import { IPokemon } from "../types";

const pokemonSchema = new mongoose.Schema<IPokemon>({
    id: {
        type: String,
        required: [true, "A pokemon needs a ID."],
        maxlength: [3, "ID to high"],
        minlength: [3, "ID must contain 3 letters."],
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
    rare: {
        type: Boolean
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    location: [{
        zones: {
            type: [String],
            default: ["green"],
        },
        odds: {
            type: Number,
            default: 23,
        }
    }],
    // location: new mongoose.Schema({
    // zones: {
    //     type: [String],
    //     default: ["green"],
    // },
    // odds: {
    //     type: Number,
    //     default: 23,
    // },
    // })
})

//DOC MIDDLEWARE "Pre"
pokemonSchema.pre("save", function (next) { 
    //Mongoose bugfix, read more https://mongoosejs.com/docs/subdocs.html#subdocuments-versus-nested-paths
    this.location = {}
    next()
})

//DOC MIDDLEWARE "Post"
pokemonSchema.post("save", function (doc, next) {
    next()
})

// QUERY MIDDLEWARE "PRE"
pokemonSchema.pre(/^find/, function (next) {
    //@ts-ignore
    this.find({ rare: { $ne: false } });
    next();
})
// QUERY MIDDLEWARE "POST"
pokemonSchema.post(/^find/, function (query, next) {
    next()
})

// AGGREGATE MIDDLEWARE "PRE"
pokemonSchema.pre("aggregate", function (next) {

    const stage = { $match: { rare: { $ne: true } } };
    this.pipeline().unshift(stage);

    next();
});




export const Pokemon = mongoose.model('Pokemon', pokemonSchema)


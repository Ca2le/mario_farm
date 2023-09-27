"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pokemon = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const pokemonSchema = new mongoose_1.default.Schema({
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
    }
});
//DOC MIDDLEWARE "Pre"
pokemonSchema.pre("save", function (next) {
    this.img = this.img + ".xh";
    next();
});
//DOC MIDDLEWARE "Post"
pokemonSchema.post("save", function (doc, next) {
    next();
});
// QUERY MIDDLEWARE "PRE"
pokemonSchema.pre(/^find/, function (next) {
    //@ts-ignore
    this.find({ rare: { $ne: false } });
    next();
});
// QUERY MIDDLEWARE "POST"
pokemonSchema.post(/^find/, function (query, next) {
    next();
});
// AGGREGATE MIDDLEWARE "PRE"
pokemonSchema.pre("aggregate", function (next) {
    const stage = { $match: { rare: { $ne: true } } };
    this.pipeline().unshift(stage);
    next();
});
exports.Pokemon = mongoose_1.default.model('Pokemon', pokemonSchema);
//# sourceMappingURL=pokemonModel.js.map
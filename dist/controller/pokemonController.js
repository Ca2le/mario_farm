"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePokemonByID = exports.updatePokemonByID = exports.addPokemonToDB = exports.getPokemonByID = exports.getListOfTop3Pokemons = exports.getPokemonTypes = exports.getAvreagePowerOfAType = exports.getListOfPokemons = void 0;
const pokemonModel_1 = require("../models/pokemonModel");
const generateResponse_1 = require("../utils/generateResponse");
const apiFeatures_1 = require("../utils/apiFeatures");
const catchAsyncError_1 = require("../utils/catchAsyncError");
const appError_1 = require("../utils/appError");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.getListOfPokemons = (0, catchAsyncError_1.catchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const features = new apiFeatures_1.APIFeatures(pokemonModel_1.Pokemon.find(), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();
    const list = yield pokemonModel_1.Pokemon.find(features.queryObj);
    (0, generateResponse_1.generateResponse)(res, generateResponse_1.httpStatus.OK, 'successMsg', list);
}));
exports.getAvreagePowerOfAType = (0, catchAsyncError_1.catchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query;
    if (query.type) {
        const avragePokemonPowers = yield pokemonModel_1.Pokemon.aggregate([
            {
                $match: {
                    type: { $in: [query.type] }
                }
            },
            {
                $sort: {
                    max_power: -1
                }
            },
            {
                $limit: 2
            },
            {
                $group: {
                    _id: "$name",
                    max_power: { $first: "$max_power" }
                }
            }
        ]);
        if (!avragePokemonPowers) {
            // return generateError()
        }
        return (0, generateResponse_1.generateResponse)(res, 200, "Pokemons was found!", avragePokemonPowers);
    }
}));
exports.getPokemonTypes = (0, catchAsyncError_1.catchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const pokemonByType = yield pokemonModel_1.Pokemon.aggregate([
        {
            $unwind: "$type"
        },
    ]);
    if (!pokemonByType) {
        // return generateError()
    }
    return (0, generateResponse_1.generateResponse)(res, 200, "Pokemons was found!", pokemonByType);
}));
exports.getListOfTop3Pokemons = (0, catchAsyncError_1.catchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    req.query.sort = "max_power";
    req.query.page = "1";
    req.query.limit = "3";
    req.query.max_power = { gte: '380' };
    next();
}));
const getPokemonByID = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const ID = req.params.id;
    const fetchedPokemon = yield pokemonModel_1.Pokemon.findOne({ id: ID });
    if (!fetchedPokemon) {
        return next(new appError_1.AppError(`No pokemon exist by id: ${ID}.`, generateResponse_1.httpStatus.BAD_REQUEST));
    }
    return (0, generateResponse_1.generateResponse)(res, 200, `Found a pokemon named: ${fetchedPokemon.name}, in the DB.`, fetchedPokemon);
});
exports.getPokemonByID = getPokemonByID;
exports.addPokemonToDB = (0, catchAsyncError_1.catchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const createdPokemon = yield pokemonModel_1.Pokemon.create(req.body);
    if (!createdPokemon) {
        console.log(createdPokemon);
        // return next 
    }
    return (0, generateResponse_1.generateResponse)(res, 201, `${createdPokemon.name} has been successfully created to the DB!`, createdPokemon);
}));
exports.updatePokemonByID = (0, catchAsyncError_1.catchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, type, effective, weakness, min_power, max_power, img, rare, createdAt } = req.body;
    const updates = { name, type, effective, weakness, min_power, max_power, img, rare, createdAt };
    const pokemonWasUpdated = yield pokemonModel_1.Pokemon.findOneAndUpdate({ id: req.params.id }, updates, { new: true });
    if (!pokemonWasUpdated) {
        // return generateError()
    }
    else
        return (0, generateResponse_1.generateResponse)(res, 200, `${pokemonWasUpdated.name} has been successfully created to the DB!`, pokemonWasUpdated);
}));
exports.deletePokemonByID = (0, catchAsyncError_1.catchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const ID = req.params.id;
    const pokemonWasDeleted = yield pokemonModel_1.Pokemon.findOneAndDelete({ id: ID });
    // if (!pokemonWasDeleted) return next(new AppError(`No pokemon to delete with that ID: ${ID}.`, httpStatus.BAD_REQUEST))
    if (!pokemonWasDeleted) {
        // return generateError()
    }
    else
        return (0, generateResponse_1.generateResponse)(res, 200, `${pokemonWasDeleted.name} has been deleted from DB. 🚮`, pokemonWasDeleted);
}));
//# sourceMappingURL=pokemonController.js.map
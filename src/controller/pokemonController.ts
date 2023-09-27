import { NextFunction, Request, Response } from "express"
import { Pokemon } from "../models/pokemonModel"
import { generateResponse, httpStatus } from "../utils/generateResponse";
import { APIFeatures } from "../utils/apiFeatures";
import { catchAsyncError } from "../utils/catchAsyncError";
import { AppError } from "../utils/appError";
import dotenv from "dotenv"
dotenv.config()

export const getListOfPokemons = catchAsyncError(async (req: any, res: any, next: NextFunction) => {
    const features = new APIFeatures(Pokemon.find(), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();
    const list = await Pokemon.find(features.queryObj);
    generateResponse(res, httpStatus.OK, 'successMsg', list)
});

export const getAvreagePowerOfAType = catchAsyncError(async (req: any, res: any, next: NextFunction) => {
    const query = req.query
    if (query.type) {
        const avragePokemonPowers = await Pokemon.aggregate([
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
        ])
        if (!avragePokemonPowers) {
            // return generateError()
        }

        return generateResponse(res, 200, "Pokemons was found!", avragePokemonPowers);

    }
});

export const getPokemonTypes = catchAsyncError(async (req: any, res: any, next: NextFunction) => {
    const pokemonByType = await Pokemon.aggregate([
        {
            $unwind: "$type"
        },
    ]);
    if (!pokemonByType) {
        // return generateError()
    }
    return generateResponse(res, 200, "Pokemons was found!", pokemonByType);
});

export const getListOfTop3Pokemons = catchAsyncError(async (req: any, res: any, next: NextFunction) => {
    req.query.sort = "max_power"
    req.query.page = "1"
    req.query.limit = "3"
    req.query.max_power = { gte: '380' }
    next()
})

export const getPokemonByID = async (req: Request, res: Response, next: NextFunction) => {
    const ID = req.params.id
    const fetchedPokemon = await Pokemon.findOne({ id: ID });
    if (!fetchedPokemon) {
        return next(new AppError(`No pokemon exist by id: ${ID}.`, httpStatus.BAD_REQUEST))
    }
    return generateResponse(res, 200, `Found a pokemon named: ${fetchedPokemon.name}, in the DB.`, fetchedPokemon);
}; 

export const addPokemonToDB = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {

    const createdPokemon = await Pokemon.create(req.body);
    if (!createdPokemon) {
        console.log(createdPokemon)
        // return next 
    }
    return generateResponse(res, 201, `${createdPokemon.name} has been successfully created to the DB!`, createdPokemon);
});

export const updatePokemonByID = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const { name, type, effective, weakness, min_power, max_power, img, rare, createdAt } = req.body
    const updates = { name, type, effective, weakness, min_power, max_power, img, rare, createdAt }
    const pokemonWasUpdated = await Pokemon.findOneAndUpdate({ id: req.params.id }, updates, { new: true });

    if (!pokemonWasUpdated) {
        // return generateError()
    } else return generateResponse(res, 200, `${pokemonWasUpdated.name} has been successfully created to the DB!`, pokemonWasUpdated);

});

export const deletePokemonByID = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const ID = req.params.id;
    const pokemonWasDeleted = await Pokemon.findOneAndDelete({ id: ID });
    // if (!pokemonWasDeleted) return next(new AppError(`No pokemon to delete with that ID: ${ID}.`, httpStatus.BAD_REQUEST))
    if (!pokemonWasDeleted) {
        // return generateError()
    } else return generateResponse(res, 200, `${pokemonWasDeleted.name} has been deleted from DB. 🚮`, pokemonWasDeleted);
});



import { NextFunction, Request, Response } from "express"
import { Pokemon } from "../models/pokemonModel"
import { generateResponse, httpStatus } from "../utils/responseUtils";

enum SortDirection {
    lowToHigh = 1,
    highToLow = -1
}

export const getListOfTop3Pokemons = async (req: any, res: any, next: NextFunction) => {
    req.query.sort = "max_power"
    req.query.page = "1"
    req.query.limit = "3"
    req.query.max_power = { gte: '380' }
    next()
}

export const getListOfPokemons = async (req: any, res: any) => {
    try {
        let query = { ...req.query };
        console.log(req.query)
        const excludeFieldsFromQuery = ["sort", "page", "limit", "fields"]
        excludeFieldsFromQuery.forEach(field => delete query[field])

        let queryString = JSON.stringify(query)
        queryString = queryString.replace(/\b(gte|gt|lte|lt|in)\b/g, match => `$${match}`)
        query = JSON.parse(queryString)

        let pokemonQuery = Pokemon.find(query)

        // if sorting data is requested
        if (typeof (req.query.sort) === "string") {
            const query = req.query.sort.split(',')
            const sortQueries: Record<string, number> = {}
            query.forEach((key: string) => sortQueries[key] = SortDirection.highToLow)
            //@ts-ignore
            pokemonQuery = pokemonQuery.sort(sortQueries)
        }
        // if limited fields of data is requested
        if (typeof (req.query.fields) === "string") {
            const selectQeries = req.query.fields.replace(",", " ")
            //@ts-ignore
            pokemonQuery = pokemonQuery.select(selectQeries)
        }
        // if amount of pages is requested
        if (typeof (req.query.page) === "string" || typeof (req.query.limit) === "string") {
            const numberOfPokemonsInDB = await Pokemon.countDocuments()
            const pages = req.query.page * 1 ? req.query.page : 1
            const limit = req.query.limit * 1 ? req.query.limit : 2
            const skip = (pages - 1) * limit
            if (skip >= numberOfPokemonsInDB) {
                throw new Error('Page dont exist.')
            }
            pokemonQuery = pokemonQuery.skip(skip).limit(limit)
        }

        const result = await pokemonQuery.exec()

        //@ts-ignore
        const successMsg = `Found ${result.length} pokemons in DB!`;

        generateResponse(res, httpStatus.OK, successMsg, result)

    } catch (error) {
        const errorMsg = "Error, No pokemons were found";
        generateResponse(res, httpStatus.INTERNAL_SERVER_ERROR, errorMsg, error)
    }
};

export const getPokemonByID = async (req: Request, res: Response) => {
    try {
        const ID = req.params.id
        const pokemon = await Pokemon.findOne({ id: ID });
        if (pokemon) {
            const successMsg = `Found ${pokemon.name} pokemons in DB!`;
            generateResponse(res, httpStatus.OK, successMsg, pokemon)

        } else {
            const errorMsg = `No pokemon exist by id: ${ID}.`;
            generateResponse(res, httpStatus.NOT_FOUND, errorMsg)
        }

    } catch (error) {
        const errorMsg = "Error, No pokemons found";
        generateResponse(res, httpStatus.INTERNAL_SERVER_ERROR, errorMsg, error)
    }
};

export const addPokemonToDB = async (req: Request, res: Response) => {
    try {
        const body = req.body;
        await Pokemon.create(body);
        const successMsg = `${body.name} has been successfully saved in the DB!`;
        generateResponse(res, httpStatus.CREATED, successMsg, body)

    } catch (error) {
        const errorMsg = "Something went wrong when posting your pokemon to the DB";
        generateResponse(res, httpStatus.INTERNAL_SERVER_ERROR, errorMsg, error)
    }
};

export const updatePokemonByID = async (req: Request, res: Response) => {
    try {
        const ID = req.params.id;
        const body = req.body;
        const updatedPokemon = await Pokemon.findOneAndUpdate({ id: ID }, body, { new: true });

        if (updatedPokemon) {
            const successMsg = `${updatedPokemon.name} has been successfully updated in the DB.`;

            generateResponse(res, httpStatus.OK, successMsg, updatedPokemon)
        } else {
            const errorMsg = `No pokemon found with ID: ${ID}.`;
            generateResponse(res, httpStatus.NOT_FOUND, errorMsg)
        }

    } catch (error) {
        const errorMsg = "An error occurred while updating the pokemon.";
        generateResponse(res, httpStatus.INTERNAL_SERVER_ERROR, errorMsg, error)
    }
};

export const deletePokemonByID = async (req: Request, res: Response) => {
    try {
        const ID = req.params.id;
        const deletedPokemon = await Pokemon.findOneAndDelete({ id: ID });

        if (deletedPokemon) {
            const successMsg = `${deletedPokemon.name} has been successfully deleted from the DB.`;
            generateResponse(res, httpStatus.OK, successMsg)
        } else {
            const errorMsg = `No pokemon found with ID: ${ID}.`;
            generateResponse(res, httpStatus.NOT_FOUND, errorMsg)
        }

    } catch (error) {
        const errorMsg = "An error occurred while deleting the pokemon.";
        generateResponse(res, httpStatus.INTERNAL_SERVER_ERROR, errorMsg, error)
    }
};

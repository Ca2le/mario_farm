import express from "express"
import { getListOfPokemons, addPokemonToDB, getPokemonByID, updatePokemonByID, deletePokemonByID, getListOfTop3Pokemons, getAvreagePowerOfAType, getPokemonTypes } from "../controller/pokemonController"
import { authCheck, restricted } from "../controller/authController"

const router = express.Router()
router.route("/pokemon/get-strongest").get(authCheck, restricted, getAvreagePowerOfAType)
router.route("/pokemon/getType").get(getPokemonTypes)

router.route("/pokemon/top-3").get(getListOfTop3Pokemons, getListOfPokemons)
router.route("/pokemon/").get(getListOfPokemons).post(addPokemonToDB)

router.route("/pokemon/:id").get(getPokemonByID).put(updatePokemonByID).delete(deletePokemonByID)

export default router
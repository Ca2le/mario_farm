import express from "express"
import { getListOfPokemons, addPokemonToDB, getPokemonByID, updatePokemonByID, deletePokemonByID, getListOfTop3Pokemons } from "../controller/pokemonController"

const router = express.Router()
router.route("/pokemon/top-3").get(getListOfTop3Pokemons, getListOfPokemons)
router.route("/pokemon/").get(getListOfPokemons).post(addPokemonToDB)

router.route("/pokemon/:id").get(getPokemonByID).put(updatePokemonByID).delete(deletePokemonByID)

export default router
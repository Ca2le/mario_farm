"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const pokemonController_1 = require("../controller/pokemonController");
const authController_1 = require("../controller/authController");
const router = express_1.default.Router();
router.route("/pokemon/get-strongest").get(authController_1.routeAuth, pokemonController_1.getAvreagePowerOfAType);
router.route("/pokemon/getType").get(pokemonController_1.getPokemonTypes);
router.route("/pokemon/top-3").get(pokemonController_1.getListOfTop3Pokemons, pokemonController_1.getListOfPokemons);
router.route("/pokemon/").get(pokemonController_1.getListOfPokemons).post(pokemonController_1.addPokemonToDB);
router.route("/pokemon/:id").get(pokemonController_1.getPokemonByID).put(pokemonController_1.updatePokemonByID).delete(pokemonController_1.deletePokemonByID);
exports.default = router;
//# sourceMappingURL=pokemonRoute.js.map
// RecipeRoutes
import { Router } from "express";
import { createCategory, getAllCategories } from "../controller/categoryController";
import { createSubCategory, getAllSubCategories } from "../controller/subCatController";
import { createNutrition, getAllNutritions } from "../controller/nutritionController";
import { createProducer, getAllProducers } from "../controller/producerController";
import { createProduct, getAllProducts } from "../controller/productController";
import { createSupplier, getAllSuppliers } from "../controller/supplierController";

import { signUp, login, authCheck, forgotPassword, resetPassword, updatePassword } from "../controller/authController";
import { createCountry, getAllCountries } from "../controller/countryController";
import { createRecipe, deleteRecipeByID, getAllRecipes, getRecipeByID, updateRecipeByID } from "../controller/recipeController";

const route = Router().route
// RecipeRoutes
route('/recipe').get(getAllRecipes).post(createRecipe)
route('/recipe:id').get(getRecipeByID).delete(deleteRecipeByID).put(updateRecipeByID)
route('/category').get(getAllCategories).post(createCategory)
route('/nutrition').get(getAllNutritions).post(createNutrition)
route('/producer').get(getAllProducers).post(createProducer)
route('/product').get(getAllProducts).post(createProduct)
route('/sub_category').get(getAllSubCategories).post(createSubCategory)
route('/supplier').get(getAllSuppliers).post(createSupplier)
route('/country').get(getAllCountries).post(createCountry)

// AuthRoutes
route("/signup").post(signUp)
route("/login").post(authCheck, login)
route("/forgot-password").post(forgotPassword)
route("/reset-password/:token").patch(resetPassword)
route("/update-password/:id").patch(authCheck, updatePassword)

export default route
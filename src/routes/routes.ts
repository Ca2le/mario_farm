import { Router } from "express";
import {
    createCategory,
    getAllCategories,
} from "../controller/categoryController";
import {
    createSubCategory,
    getAllSubCategories,
} from "../controller/subCatController";
import {
    createNutrition,
    getAllNutritions,
} from "../controller/nutritionController";
import {
    createProducer,
    getAllProducers,
} from "../controller/producerController";
import { createProduct, getAllProducts } from "../controller/productController";
import {
    createSupplier,
    getAllSuppliers,
} from "../controller/supplierController";
import {
    createCountry,
    getAllCountries,
} from "../controller/countryController";
import {
    createRecipe,
    deleteRecipeByID,
    getAllRecipes,
    getRecipeByID,
    updateRecipeByID,
} from "../controller/recipeController";
import {
    signUp,
    login,
    authCheck,
    forgotPassword,
    resetPassword,
    updatePassword,
    passwordVerification,
    emailPinVerification,
    tokenVerification,
} from "../controller/authController";
import {
    createFolder,
    storeImage,
    storeFileInMemory,
} from "../controller/imageController";
import { getAllIndexes } from "../controller/indexController";

const router = Router();

// ImageRoutes
// www.receptify.se/image/12sadio12i3jco12312
router
    .route("/image/:id")
    .patch(authCheck, storeFileInMemory, createFolder, storeImage);

// RecipeRoutes
router
    .route("/recipe")
    .get(authCheck, getAllRecipes)
    .post(authCheck, createRecipe);
router
    .route("/recipe/:recipe_id")
    .get(authCheck, getRecipeByID)
    .delete(authCheck, deleteRecipeByID)
    .put(authCheck, updateRecipeByID);
router
    .route("/category")
    .get(authCheck, getAllCategories)
    .post(authCheck, createCategory);
router
    .route("/nutrition")
    .get(authCheck, getAllNutritions)
    .post(createNutrition);
router
    .route("/producer")
    .get(authCheck, getAllProducers)
    .post(authCheck, createProducer);
router
    .route("/product")
    .get(authCheck, getAllProducts)
    .post(authCheck, createProduct);
router
    .route("/sub_category")
    .get(authCheck, getAllSubCategories)
    .post(authCheck, createSubCategory);
router
    .route("/supplier")
    .get(authCheck, getAllSuppliers)
    .post(authCheck, createSupplier);
router
    .route("/country")
    .get(authCheck, getAllCountries)
    .post(authCheck, createCountry);

router
    .route("/index_values")
    .get(getAllIndexes)

// AuthRoutes
router.route("/signup").post(signUp);
router.route("/login/s1").post(passwordVerification);
router.route("/login/s2/:id").post(emailPinVerification);
router.route("/forgot_password").post(forgotPassword);
router.route("/reset_password/:token").post(resetPassword);
router.route("/update_password/:id").patch(authCheck, updatePassword);

export default router;

// www.receptify.se/callekock/recept

//COOKIETEST
// router.route('/cookie').get((req, res, next) => {
//   res.cookie('tokenBlack', 'Tokens Cookie.');
//   res.end();
// });
// router.route('/cookie2').get((req, res, next) => {
//   res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:3000');
//   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
//   res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
//   res.setHeader('Access-Control-Allow-Credentials', 'true');

//   const cookieName = 'Token';
//   const cookieValue = 'Token-Black-Production';
//   const maxAge = 30000; // 15 minutes in milliseconds
//   const cookieHeader = `${cookieName}=${cookieValue}; Max-Age=${maxAge}; Path=/; HttpOnly=true; SameSite=Strict; Domain=127.0.0.1`;

//   res.setHeader('Set-Cookie', cookieHeader)
//   res.end();
// });
// router.route('/cookie').get((req, res, next) => {
//     // console.log('send that cookie!')
//     // const expires = new Date(Date.now() + Number(process.env.COOKIE_EXPIRES))
//     res.cookie('tokenBlack', 'Cookie?')
//     res.send('Token Black was sent.')
// });

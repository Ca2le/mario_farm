import { NextFunction, Request, Response } from "express";
import { catchAsyncError } from "../utils/catchAsyncError";
import { APIFeatures } from "../utils/apiFeatures";
import { generateResponse, httpStatus } from "../utils/generateResponse";
import { IProduct } from "../models/productModel";
import { Ingredient } from "../models/ingredientModel";

export const getAllProducts = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const features = new APIFeatures(Ingredient.find(), req.query)
    features
        .filter()
        .sort()
        .paginate()
        .fields()

    const queryDocument = await Ingredient.find(features)

    generateResponse(res, httpStatus.OK, "Succesfully fetched all custom ingridients!")
})

export const createProduct = catchAsyncError(async (request: Request, response: Response, next: NextFunction) => {
    const {
        name,
        prod_ingredients,
        image,
        milliliter,
        gram,
        produced,
        origin,
        nutrition,
        category,
        supplier,
    }: IProduct = request.body

    const product = await Ingredient.create({
        name,
        prod_ingredients,
        image,
        milliliter,
        gram,
        produced,
        origin,
        nutrition,
        category,
        supplier,
    })

    generateResponse(response, httpStatus.CREATED, `${name} was added as a product. 🎉`, product)
})




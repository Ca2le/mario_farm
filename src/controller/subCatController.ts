import { NextFunction, Request, Response } from "express";
import { catchAsyncError } from "../utils/catchAsyncError";
import { APIFeatures } from "../utils/apiFeatures";
import { ICustomIngredient, Ingredient } from "../models/ingredientModel";
import { generateResponse, httpStatus } from "../utils/generateResponse";
import { ISubCat } from "../models/subCatModel";

export const getAllSubCategories = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const features = new APIFeatures(Ingredient.find(), req.query)
    features
        .filter()
        .sort()
        .paginate()
        .fields()

        const queryDocument = await Ingredient.find(features)

        generateResponse(res, httpStatus.OK, "Succesfully fetched all subcategories!", queryDocument)
})

export const createSubCategory = catchAsyncError(async (request: Request, response: Response, next: NextFunction) => {
    const {
        name,
        image,
        description
    }: ISubCat = request.body

    const subCategory = await Ingredient.create({
        name,
        image,
        description
    })

    generateResponse(response, httpStatus.CREATED, `🐮🌾${name} was created as a sub category🥬🥩`, subCategory)
})
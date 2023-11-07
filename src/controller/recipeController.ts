import { NextFunction, Request, Response } from "express";
import { catchAsyncError } from "../utils/catchAsyncError";
import { APIFeatures } from "../utils/apiFeatures";
import { IRecipe, Recipe } from "../models/recipeModel";
import { generateResponse, httpStatus } from "../utils/generateResponse";

export const getAllRecipes = catchAsyncError(async (request: Request, response: Response, next: NextFunction) => {
    const features = new APIFeatures(Recipe.find(), request.query)
    features
        .filter()
        .sort()
        .fields()
        .paginate()

    const data = await Recipe.find(features.queryDocument)

    generateResponse(response, httpStatus.OK, "Succesfully fetched recipe data!", data)
})

export const createRecipe = catchAsyncError(async (request: Request, response: Response, next: NextFunction) => {
    const {
        name,
        description,
        ingridient,
        instructions,
        category,
        author,
        created,
        rating,
        prep_time,
        cook_time
    }: IRecipe = request.body

    const recipe = await Recipe.create({
        name,
        description,
        ingridient,
        instructions,
        category,
        author,
        created,
        rating,
        prep_time,
        cook_time
    })

    generateResponse(response, httpStatus.CREATED, `${name} was uploaded.🍌`, recipe)
})

export const getRecipeByID = catchAsyncError(async (request: Request, response: Response, next: NextFunction) => {
    const { id } = request.params
    const recipe = await Recipe.findById(id)
    generateResponse(response, httpStatus.OK, "Recipe has been found🔭.", recipe)
})

export const deleteRecipeByID = catchAsyncError(async (request: Request, response: Response, next: NextFunction) => {
    const { id } = request.params
    await Recipe.findByIdAndDelete(id)
    generateResponse(response, httpStatus.OK, "Recipe has been deleted🧹.")
})

export const updateRecipeByID = catchAsyncError(async (request: Request, response: Response, next: NextFunction) => {
    // JIRA TICKET HAS BEEN CREATED - 2023-11-06
    generateResponse(response, httpStatus.OK, "Recipe has been updated ✅.")
})
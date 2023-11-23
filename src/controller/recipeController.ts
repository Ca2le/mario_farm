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

    const data = await Recipe
        .find(features.queryDocument)
        .populate(
            {
                path: 'product_ids',
                select: 'name sub_category category image',
                populate: [
                    {
                        path: 'sub_category',
                        select: 'name -_id'
                    },
                    {
                        path: 'category',
                        select: 'name -_id'
                    }
                ]
            }
        )

    generateResponse(response, httpStatus.OK, "Succesfully fetched recipe data!", data)
})

export const createRecipe = catchAsyncError(async (request: Request, response: Response, next: NextFunction) => {
    const {
        name,
        description,
        product_ids,
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
        product_ids,
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
    const { recipe_id } = request.params
    const recipe = await Recipe
        .findById(recipe_id)
        .populate({
            path: 'product_ids', populate: [
                { path: 'origin', model: 'Country' },
                { path: 'produced', model: 'Country' },
                { path: 'category', model: 'Category' },
                { path: 'supplier', model: 'Supplier' },
                { path: 'nutrition.nutr_id', model: 'Nutrition' }
            ]
        })
    generateResponse(response, httpStatus.OK, "Recipe has been found🔭.", recipe)
})

export const deleteRecipeByID = catchAsyncError(async (request: Request, response: Response, next: NextFunction) => {
    const { recipe_id } = request.params
    await Recipe.findByIdAndDelete(recipe_id)
    generateResponse(response, httpStatus.OK, "Recipe has been deleted🧹.")
})

export const updateRecipeByID = catchAsyncError(async (request: Request, response: Response, next: NextFunction) => {
    // JIRA TICKET HAS BEEN CREATED - 2023-11-06
    generateResponse(response, httpStatus.OK, "Recipe has been updated ✅.")
})
import { NextFunction, Request, Response } from "express";
import { catchAsyncError } from "../utils/catchAsyncError";
import { APIFeatures } from "../utils/apiFeatures";
import { ICustomIngredient, Ingredient } from "../models/ingredientModel";
import { generateResponse, httpStatus } from "../utils/generateResponse";
import { Country, ICountry } from "../models/countryModel";

export const getAllCountries = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const features = new APIFeatures(Country.find(), req.query)
    features
        .filter()
        .sort()
        .paginate()
        .fields()

    const queryDocument = await Country.find(features)

    generateResponse(res, httpStatus.OK, "Succesfully fetched all custom producers!", queryDocument)
})

export const createCountry = catchAsyncError(async (request: Request, response: Response, next: NextFunction) => {
    const {
        name,
        continent,
        image
    }: ICountry = request.body

    const country = await Country.create({
        name,
        continent,
        image
    })

    generateResponse(response, httpStatus.CREATED, `${country.name} was created. 🌍`, country)
})

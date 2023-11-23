import { NextFunction, Request, Response } from "express";
import { catchAsyncError } from "../utils/catchAsyncError";
import { APIFeatures } from "../utils/apiFeatures";
import { generateResponse, httpStatus } from "../utils/generateResponse";
import { INutrition, Nutrition } from "../models/nutritionModel";

export const getAllNutritions = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const features = new APIFeatures(Nutrition.find(), req.query)
    features
        .filter()
        .sort()
        .paginate()
        .fields()

        const queryDocument = await Nutrition.find(features)

        generateResponse(res, httpStatus.OK, "Succesfully fetched all nutritons!", queryDocument)
})

export const createNutrition = catchAsyncError(async (request: Request, response: Response, next: NextFunction) => {
    const {
        name,
        measurement
    }: INutrition = request.body

    const supplier = await Nutrition.create({
        name,
        measurement
    })

    generateResponse(response, httpStatus.CREATED, `A new nutrition has been created! ${name}🛒`, supplier)
})
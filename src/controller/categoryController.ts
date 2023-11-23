import { NextFunction, Request, Response } from "express";
import { catchAsyncError } from "../utils/catchAsyncError";
import { APIFeatures } from "../utils/apiFeatures";
import { generateResponse, httpStatus } from "../utils/generateResponse";
import { Category, ICategory } from "../models/categoryModel";

export const getAllCategories = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const features = new APIFeatures(Category.find(), req.query)
    features
        .filter()
        .sort()
        .paginate()
        .fields()

        const queryDocument = await Category.find(features)

        generateResponse(res, httpStatus.OK, "Succesfully fetched all custom ingridients!", queryDocument)
})

export const createCategory = catchAsyncError(async (request: Request, response: Response, next: NextFunction) => {
    const {
        name,
        image_name,
        image_path,
        description
    }: ICategory = request.body

    const category = await Category.create({
        name,
        image_name,
        image_path,
        description
    })

    generateResponse(response, httpStatus.CREATED, `🐠 Category ${name} was created. 🐬🪸`, category)
})




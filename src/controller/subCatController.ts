import { NextFunction, Request, Response } from "express";
import { catchAsyncError } from "../utils/catchAsyncError";
import { APIFeatures } from "../utils/apiFeatures";
import { generateResponse, httpStatus } from "../utils/generateResponse";
import { ISubCat, SubCat } from "../models/subCatModel";

export const getAllSubCategories = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const features = new APIFeatures(SubCat.find(), req.query)
    features
        .filter()
        .sort()
        .paginate()
        .fields()

        const queryDocument = await SubCat.find(features)

        generateResponse(res, httpStatus.OK, "Succesfully fetched all subcategories!", queryDocument)
})

export const createSubCategory = catchAsyncError(async (request: Request, response: Response, next: NextFunction) => {
    const {
        name,
        image_name,
        image_path,
        description
    }: ISubCat = request.body

    const subCategory = await SubCat.create({
        name,
        image_name,
        image_path,
        description
    })

    generateResponse(response, httpStatus.CREATED, `🐮🌾${name} was created as a sub category🥬🥩`, subCategory)
})
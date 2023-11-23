import { NextFunction, Request, Response } from "express";
import { catchAsyncError } from "../utils/catchAsyncError";
import { APIFeatures } from "../utils/apiFeatures";
import { generateResponse, httpStatus } from "../utils/generateResponse";
import { IProduct, Product } from "../models/productModel";

export const getAllProducts = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const features = new APIFeatures(Product.find(), req.query)
    features
        .filter()
        .sort()
        .paginate()
        .fields()

    const queryDocument = await Product.find(features)

    generateResponse(res, httpStatus.OK, "Succesfully fetched all custom ingridients!")
})

export const createProduct = catchAsyncError(async (request: Request, response: Response, next: NextFunction) => {
    const {
        name,
        ingredients,
        image_name,
        image_path,
        milliliter,
        gram,
        produced,
        origin,
        nutrition,
        category,
        supplier,
        sub_category
    }: IProduct = request.body
    const product = await Product.create({
        name,
        ingredients,
        image_name,
        image_path,
        milliliter,
        gram,
        produced,
        origin,
        nutrition,
        category,
        supplier,
        sub_category
    })

    generateResponse(response, httpStatus.CREATED, `${name} was added as a product. 🎉`, product)
})




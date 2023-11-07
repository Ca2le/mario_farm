import { NextFunction, Request, Response } from "express";
import { catchAsyncError } from "../utils/catchAsyncError";
import { APIFeatures } from "../utils/apiFeatures";
import { generateResponse, httpStatus } from "../utils/generateResponse";
import { ISupplier, Supplier } from "../models/supplier";

export const getAllSuppliers = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const features = new APIFeatures(Supplier.find(), req.query)
    features
        .filter()
        .sort()
        .paginate()
        .fields()

        const queryDocument = await Supplier.find(features)

        generateResponse(res, httpStatus.OK, "Succesfully fetched all suppliers!", queryDocument)
})

export const createSupplier = catchAsyncError(async (request: Request, response: Response, next: NextFunction) => {
    const {
        name,
        url,
        image,
        description
    }: ISupplier = request.body

    const supplier = await Supplier.create({
        name,
        url,
        image,
        description
    })

    generateResponse(response, httpStatus.CREATED, `A new supplier has been created! 🚛${name}🛒`, supplier)
})
import { NextFunction, Request, Response } from "express";
import { catchAsyncError } from "../utils/catchAsyncError";
import { APIFeatures } from "../utils/apiFeatures";
import { generateResponse, httpStatus } from "../utils/generateResponse";
import { IProducer, Producer } from "../models/producerModel";

export const getAllProducers = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const features = new APIFeatures(Producer.find(), req.query)
    features
        .filter()
        .sort()
        .paginate()
        .fields()

    const queryDocument = await Producer.find(features)

    generateResponse(res, httpStatus.OK, "Succesfully fetched all custom producers!", queryDocument)
})

export const createProducer = catchAsyncError(async (request: Request, response: Response, next: NextFunction) => {
    const {
        name,
        image_name,
        image_path,
        description,
        location
    }: IProducer = request.body

    const producer = await Producer.create({
        name,
        image_name,
        image_path,
        description,
        location
    })

    generateResponse(response, httpStatus.CREATED, `${producer.name} was created. 👨🏿‍🌾`, producer)
})

import { NextFunction, Response, Request } from "express"
import { catchAsyncError } from "../utils/catchAsyncError"
import { generateResponse, httpStatus } from "../utils/generateResponse"
import { DataIndex, IDataIndex } from "../models/indexModel"

export const getAllIndexes = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const data = await DataIndex.findOne({}) as IDataIndex
    if (data) {
        const { countries, categories, nutritions, manufactorers, suppliers, producers, products, sub_categories } = data
        generateResponse(res, httpStatus.OK, "Indexes was succesfully loaded", { countries, categories, nutritions, manufactorers, suppliers, producers, products, sub_categories })
    } else res.end()

})
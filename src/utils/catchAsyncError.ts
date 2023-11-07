import { Request, Response, NextFunction } from "express"
import { CustomRequest } from "../types"

export const catchAsyncError = (routeHandler: (req: any, res: Response, next: NextFunction) => Promise<any>) => {
    return (req: any, res: Response, next: NextFunction) => {
        routeHandler(req, res, next).catch((err: any) => {
            next(err)
        })
    }
}
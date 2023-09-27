import { Request, Response, NextFunction } from "express"

export const catchAsyncError = (routeFn: (req: Request, res: Response, next: NextFunction) => Promise<any>) => {
    return (req: Request, res: Response, next: NextFunction) => {
        routeFn(req, res, next).catch((err: any) => {
            next(err)
        })
    }
}
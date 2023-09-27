import { Response, Request, NextFunction } from "express";

export function globalError(err: any, req: Request, res: Response, next: NextFunction) {
    res.status(500).send('Something broke!')
    
}
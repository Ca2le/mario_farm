import { NextFunction, Request, Response } from "express";
import { catchAsyncError } from "../utils/catchAsyncError";
import multer, { Options } from "multer";
import path from "path";
import fs, { mkdir } from 'fs/promises'
import { AppError } from "../utils/appError";
import { httpStatus } from "../types";
import { generateResponse } from "../utils/generateResponse";
import { Product } from "../models/productModel";
import { Country } from "../models/countryModel";
import { Producer } from "../models/producerModel";
import { Supplier } from "../models/supplier";
import { Model } from "mongoose";


export const storeFileInMemory = (req: Request, res: Response, next: NextFunction) => {
    const storage = multer.memoryStorage()

    const upload = multer({
        storage: storage, fileFilter: (req, file, cb) => {
            if (file.mimetype.startsWith('image') && !file.mimetype.endsWith('gif')) {
                cb(null, true)

            }
            else {

                cb(null, false)
                generateResponse(res, httpStatus.BAD_REQUEST, 'Only JPEG, PNG or SVG formats are allowed as images.')
            }
        }
    })

    const uploadMiddleware = upload.single('file')
    uploadMiddleware(req, res, (err) => {
        if (err) {
            if (err instanceof multer.MulterError) {
                next(err)
            } else {
                next(err)
            }
        }
        else next()
    })


}

export const createFolder = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const { category, sub_category, name, collection } = req.body
    let folderPath = ''

    if (collection === 'product') {
        folderPath = sub_category ? path.join('dist', 'images', `${collection}s`, category, sub_category, name) : path.join('dist', 'images', collection, category)
        await mkdir(folderPath, { recursive: true })
    }
    if (collection === 'producer' || collection === 'country' || collection === 'supplier') {
        folderPath = path.join('dist', 'images', collection, name)
        await mkdir(folderPath, { recursive: true })
    }
    req.body.folderPath = folderPath
    next()
})


const documentByID = (id: string, collection: string) => {
    let document = null
    switch (collection) {
        case 'product': {
            document = Product.findByIdAndUpdate(id)
            return document
        }
        case 'country': {
            document = Country.findByIdAndUpdate(id)
            return document
        }
        case 'producer': {
            document = Producer.findByIdAndUpdate(id)
            return document
        }
        case 'supplier': {
            document = Supplier.findByIdAndUpdate(id)
            return document
        }
        default: null
    }
}

export const storeImage = async (req: Request, res: Response, next: NextFunction) => {
    const { folderPath, name, size, collection } = req.body
    const { id } = req.params
    const { file } = req

    const document = documentByID(id, collection)
    console.log(document)
    if (file) {
        const filePath = path.join(folderPath, `${name}_${size}x.jpeg`)
        await fs.writeFile(filePath, file.buffer)
        const updatedDocument = await document?.updateOne({image_name: name, image_path: folderPath})

        generateResponse(res, httpStatus.OK, `Image was updated in ${collection}.`, updatedDocument)


    } else next(new AppError('Fail to create image', httpStatus.INTERNAL_SERVER_ERROR))
}



export const readAllImages = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {


})
export const createImage = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    next()
})
export const readImage = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {

})
export const updateImage = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {

})
export const deleteImage = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    req


})

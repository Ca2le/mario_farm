import mongoose, { Types } from "mongoose";
import { INutrition } from "./nutritionModel";

export interface IProduct {
    name: string,
    ingredients: string[],
    image_name: string,
    image_path: string,
    milliliter: number,
    gram: number,
    produced: string[]
    origin: string[],
    nutrition: INutrition[],
    category: string,
    sub_category: string,
    supplier: string[],
}

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    ingredients: [String],
    image_name: String,
    image_path: String,
    milliliter: Number,
    gram: Number,
    produced: {
        type: [mongoose.Types.ObjectId],
        ref: "Country",
    },
    origin: {
        type: [mongoose.Types.ObjectId],
        ref: "Country"
    },
    nutrition: [
        {
            nutr_id: {
                type: mongoose.Types.ObjectId,
                ref: "Nutrition"
            },
            value: Number
        }
    ],
    category: {
        type: mongoose.Types.ObjectId,
        ref: "Category"
    },
    sub_category: {
        type: mongoose.Types.ObjectId,
        ref: "SubCat"
    },
    supplier: {
        type: [mongoose.Types.ObjectId],
        ref: "Supplier"
    }
});

export const Product = mongoose.model('Product', productSchema)
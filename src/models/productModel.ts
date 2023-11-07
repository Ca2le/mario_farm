import mongoose, { Types } from "mongoose";
export interface IProduct {
    name: string,
    prod_ingredients: string[],
    image: string
    milliliter: number,
    gram: number,
    produced: Types.ObjectId[]
    origin: Types.ObjectId[],
    nutrition: Types.ObjectId,
    category: Types.ObjectId[]
    supplier: Types.ObjectId[],

}

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    prod_ingredients: [String],
    image: String,
    milliliter: Number,
    gram: Number,
    produced: {
        type: [mongoose.Types.ObjectId],
        ref: "Country"
    },
    origin: {
        type: [mongoose.Types.ObjectId],
        ref: "Country"
    },
    nutrition: {
        type: [mongoose.Types.ObjectId],
        ref: "Nutrition"
    },
    category: String,
    supplier: {
        type: [mongoose.Types.ObjectId],
        ref: "Supplier"
    }

});

export const Product = mongoose.model('Product', productSchema)
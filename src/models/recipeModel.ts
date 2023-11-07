// import { ObjectId } from "mongodb";
import mongoose, { Types } from "mongoose";

export interface I_Ingridient {
    name: string,
    product_ids: Types.ObjectId[]
}

export interface IRecipe {
    name: string,
    description: string,
    ingridient: I_Ingridient,
    instructions: string,
    prep_time: number,
    cook_time: number,
    rating: string,
    category: string,
    author: string,
    created: string
}
const recipeSchema = new mongoose.Schema<IRecipe>({
    name: {
        type: String,
        required: true,
    },
    description: String,
    ingridient: [{
        name: String,
        product_ids: [Types.ObjectId]
    }],
    instructions: String,
    prep_time: String,
    cook_time: String,
    rating: String,
    author: String,
    created: String,
    category: String
});

export const Recipe = mongoose.model('Recipe', recipeSchema)











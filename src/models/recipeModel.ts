// import { ObjectId } from "mongodb";
import mongoose, { Types } from "mongoose";

export interface IRecipe {
    name: string,
    description: string,
    product_ids: string[],
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
    product_ids: [{
        ref: 'Product',
        type: Types.ObjectId
    }],
    instructions: String,
    prep_time: String,
    cook_time: String,
    rating: String,
    author: String,
    created: String,
    category: String
});

// recipeSchema.pre('find', function () {
//     // this.populate('product_ids', '-__v')
// })

export const Recipe = mongoose.model('Recipe', recipeSchema)











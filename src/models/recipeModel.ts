// import { ObjectId } from "mongodb";
import mongoose, { Types } from "mongoose";
import { DataIndex } from "./indexModel";

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

recipeSchema.post('save', async function () {
    try {
        await DataIndex.updateOne({}, { $inc: { recipes: 1 } }, { upsert: true });
    } catch (err) {
        console.log('Couldn\'t update index data in the database. 🧐', err);
    }
});

recipeSchema.post('deleteOne', async function () {
    try {
        await DataIndex.updateOne({}, { $inc: { recipes: -1 } });
    } catch (err) {
        console.log('Couldn\'t update index data in the database. 🧐', err);
    }
});

export const Recipe = mongoose.model('Recipe', recipeSchema)











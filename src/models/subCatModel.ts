// import { ObjectId } from "mongodb";
import mongoose, { Types } from "mongoose";

export interface ISubCat {
    name: string,
    image: string,
    description: string,
}
const recipeSchema = new mongoose.Schema<ISubCat>({
    name: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
});

export const Recipe = mongoose.model('Recipe', recipeSchema)







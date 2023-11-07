import mongoose from "mongoose";
export interface ICategory {
    name: string,
    image: string,
    description: String


}
const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    image: String,
    description: String
});


export const Category = mongoose.model('Category', categorySchema)
import mongoose from "mongoose";
export interface ICategory {
    name: string,
    image_name: string,
    image_path: string,
    description: string


}
const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    image_name: String,
    image_path: String,
    description: String
});


export const Category = mongoose.model('Category', categorySchema)
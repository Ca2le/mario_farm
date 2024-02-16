import mongoose from "mongoose";
import { DataIndex } from "./indexModel";
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
// Increment count when a new Nutrition is saved
categorySchema.post('save', async function () {
    try {
        await DataIndex.updateOne({}, { $inc: { categories: 1 } }, { upsert: true });
    } catch (err) {
        console.log('Couldn\'t update index data in the database. 🧐', err);
    }
});

// Decrement count when a Nutrition is removed
categorySchema.post('deleteOne', async function () {
    try {
        await DataIndex.updateOne({}, { $inc: { categories: -1 } });
    } catch (err) {
        console.log('Couldn\'t update index data in the database. 🧐', err);
    }
});

export const Category = mongoose.model('Category', categorySchema)
// import { ObjectId } from "mongodb";
import mongoose, { Types } from "mongoose";
import { DataIndex } from "./indexModel";

export interface ISubCat {
    name: string,
    image_name: string,
    image_path: string,
    description: string,
}
const subCatSchema = new mongoose.Schema<ISubCat>({
    name: {
        type: String,
        required: true,
    },
    image_name: String,
    image_path: String,
    description: {
        type: String,
        required: true,
    },
});


subCatSchema.post('save', async function () {
    try {
        await DataIndex.updateOne({}, { $inc: { sub_categories: 1 } }, { upsert: true });
    } catch (err) {
        console.log('Couldn\'t update index data in the database. 🧐', err);
    }
});

subCatSchema.post('deleteOne', async function () {
    try {
        await DataIndex.updateOne({}, { $inc: { sub_categories: -1 } });
    } catch (err) {
        console.log('Couldn\'t update index data in the database. 🧐', err);
    }
});


export const SubCat = mongoose.model('SubCat', subCatSchema)







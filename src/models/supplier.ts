import mongoose from "mongoose";
import { DataIndex } from "./indexModel";
export interface ISupplier {
    name: string,
    url: string,
    image_name: string,
    image_path: string,
    description: string
}
const supplierSchema = new mongoose.Schema<ISupplier>({
    name: {
        type: String,
        required: true,
    },
    url: {
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

supplierSchema.post('save', async function () {
    try {
        await DataIndex.updateOne({}, { $inc: { suppliers: 1 } }, { upsert: true });
    } catch (err) {
        console.log('Couldn\'t update index data in the database. 🧐', err);
    }
});

supplierSchema.post('deleteOne', async function () {
    try {
        await DataIndex.updateOne({}, { $inc: { suppliers: -1 } });
    } catch (err) {
        console.log('Couldn\'t update index data in the database. 🧐', err);
    }
});


export const Supplier = mongoose.model('Supplier', supplierSchema)
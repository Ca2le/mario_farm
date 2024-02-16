import mongoose from "mongoose";
import { DataIndex } from "./indexModel";
export interface ICountry {
    name: string,
    continent: string,
    image_name: string,
    image_path: string,
}

const countrySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    continent: String,
    image_name: String,
    image_path: String
});
// Increment count when a new Nutrition is saved
countrySchema.post('save', async function () {
    try {
        await DataIndex.updateOne({}, { $inc: { countries: 1 } }, { upsert: true });
    } catch (err) {
        console.log('Couldn\'t update index data in the database. 🧐', err);
    }
});

// Decrement count when a Nutrition is removed
countrySchema.post('deleteOne', async function () {
    try {
        await DataIndex.updateOne({}, { $inc: { countries: -1 } });
    } catch (err) {
        console.log('Couldn\'t update index data in the database. 🧐', err);
    }
});

export const Country = mongoose.model('Country', countrySchema)
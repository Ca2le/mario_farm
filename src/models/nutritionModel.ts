import mongoose, { Document } from "mongoose";
import { DataIndex } from "./indexModel";

export interface INutrition extends Document {
    name: string;
    measurement: 'milligram' | 'percent';
}

const nutritionSchema = new mongoose.Schema<INutrition>({
    name: {
        type: String,
        required: true,
        unique: true
    },
    measurement: {
        type: String,
        required: true,
    }
});

// Increment count when a new Nutrition is saved
nutritionSchema.post('save', async function () {
    try {
        await DataIndex.updateOne({}, { $inc: { nutritions: 1 } }, { upsert: true });
    } catch (err) {
        console.log('Couldn\'t update index data in the database. 🧐', err);
    }
});

// Decrement count when a Nutrition is removed
nutritionSchema.post('deleteOne', async function () {
    try {
        await DataIndex.updateOne({}, { $inc: { nutritions: -1 } });
    } catch (err) {
        console.log('Couldn\'t update index data in the database. 🧐', err);
    }
});


export const Nutrition = mongoose.model<INutrition>('Nutrition', nutritionSchema);

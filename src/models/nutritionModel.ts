import mongoose from "mongoose";
export interface INutrition {
    name: string,
    measurement: 'milligram' | 'percent'
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

export const Nutrition = mongoose.model('Nutrition', nutritionSchema)
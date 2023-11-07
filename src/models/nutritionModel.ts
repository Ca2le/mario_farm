import mongoose from "mongoose";
export interface INutrition {
    name: String
}
const nutritionSchema = new mongoose.Schema<INutrition>({
    name: {
        type: String,
        required: true,
        unique: true
    }
});

export const Nutrition = mongoose.model('Nutrition', nutritionSchema)
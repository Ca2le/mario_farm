import mongoose from "mongoose";
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

export const Country = mongoose.model('Country', countrySchema)
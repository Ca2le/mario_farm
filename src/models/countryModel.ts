import mongoose from "mongoose";
export interface ICountry {
    name: string,
    continent: string,
    image: string,
}

const countrySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    continent: String,
    image: String
});

export const Country = mongoose.model('Country', countrySchema)
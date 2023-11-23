// import { ObjectId } from "mongodb";
import mongoose, { Types } from "mongoose";

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

export const SubCat = mongoose.model('SubCat', subCatSchema)







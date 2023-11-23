import mongoose from "mongoose";
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

export const Supplier = mongoose.model('Supplier', supplierSchema)
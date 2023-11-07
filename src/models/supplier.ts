import mongoose from "mongoose";
export interface ISupplier {
    name: String,
    url: String,
    image: String,
    description: String
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
    image: String,
    description: {
        type: String,
        required: true,
    },
});

export const Supplier = mongoose.model('Supplier', supplierSchema)
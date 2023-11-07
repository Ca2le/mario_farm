import mongoose from "mongoose";
export interface ISupplierProduct {
    incl_tax: number,
    excl_tax: number,
    discount: number,
    member_discount: boolean,
    max_amount: string,
    supplier: string,
}

const supplierProductSchema = new mongoose.Schema({
    incl_tax: {
        type: Number,
        required: true,
    },
    excl_tax: {
        type: Number,
        required: true,
    },
    discount: Number,
    member_discount: Boolean,
    max_amount: Number,
    supplier: {
        type: [mongoose.Types.ObjectId],
        ref: "Supplier"
    },
    product: {
        type: [mongoose.Types.ObjectId],
        ref: "Product"
    }
});

export const SupplierProduct = mongoose.model('Supplier_Product', supplierProductSchema)
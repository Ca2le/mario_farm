import mongoose, { Model} from "mongoose";
export interface IDataIndex{
    categories: number,
    sub_categories: number,
    countries: number,
    nutritions: number,
    producers: number,
    suppliers: number,
    products: number,
    manufactorers: number,
    recipes: number,
}

interface IDataIndexMethods {
    incrementData(name: string, amount: number): void,
    decrementData(name: string, amount: number): void,
}
type DataIndexModel = Model<IDataIndex, Document, IDataIndexMethods>

const schema = {
    categories: {
        type: Number,
        default: 0
    },
    sub_categories: {
        type: Number,
        default: 0
    },
    countries: {
        type: Number,
        default: 0
    },
    nutritions: {
        type: Number,
        default: 0
    },
    producers: {
        type: Number,
        default: 0
    },
    suppliers: {
        type: Number,
        default: 0
    },
    products: {
        type: Number,
        default: 0
    },
    manufactorers: {
        type: Number,
        default: 0
    },
    recipes: {
        type: Number,
        default: 0
    }

}

const dataIndexSchema = new mongoose.Schema<IDataIndex, DataIndexModel, IDataIndexMethods>(schema)


dataIndexSchema.method('incrementData', function (name: string, amount: number) {
    this[name] += amount

})
dataIndexSchema.method('decrementData', function (name: string, amount: number) {
    this[name] -= amount

})

export const DataIndex = mongoose.model('DataIndex', dataIndexSchema)
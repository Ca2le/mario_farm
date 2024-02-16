import mongoose, { Types } from "mongoose";
import { DataIndex } from "./indexModel";
export interface IProducer {
    name: string,
    image_name: string,
    image_path: string,
    description: string,
    location: Types.ObjectId[],
}    

const producerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    image_name: String,
    image_path: String,
    description: String,
    location: [{
        ref:"Country",
        type: Types.ObjectId,
    }]
});


producerSchema.post('save', async function () {
    try {
        await DataIndex.updateOne({}, { $inc: { producers: 1 } }, { upsert: true });
    } catch (err) {
        console.log('Couldn\'t update index data in the database. 🧐', err);
    }
});

producerSchema.post('deleteOne', async function () {
    try {
        await DataIndex.updateOne({}, { $inc: { producers: -1 } });
    } catch (err) {
        console.log('Couldn\'t update index data in the database. 🧐', err);
    }
});

export const Producer = mongoose.model('Producer', producerSchema)
import mongoose, { Types } from "mongoose";
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

export const Producer = mongoose.model('Producer', producerSchema)
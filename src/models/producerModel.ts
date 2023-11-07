import mongoose, { Types } from "mongoose";
export interface IProducer {
    name: string,
    image: string,
    description: string,
    location: Types.ObjectId[],
}    

const producerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    image: String,
    description: String,
    location: [{
        ref:"Country",
        type: Types.ObjectId,
    }]
});

export const Producer = mongoose.model('Producer', producerSchema)
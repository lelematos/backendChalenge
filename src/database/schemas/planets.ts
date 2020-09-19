import mongoose, { MongooseDocument } from 'mongoose'

interface MyPlanet extends mongoose.Document {
    name: string,
    mass: string,
    hasStation: boolean,
}

const planetSchema = new mongoose.Schema({
    name: { type: String, required: true },
    mass: { type: String, required: true },
    hasStation: { type: Boolean, required: true }
})

export const Planet = mongoose.model<MyPlanet>('Planet', planetSchema)
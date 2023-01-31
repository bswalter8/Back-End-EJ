import mongoose from "mongoose";

const carritoSchema = new mongoose.Schema({
    idUser: { type: String, required: true },
    timestamp: { type: Date, required: true },
    products: { type: Array, required: true },
    delivery: { type: Array, required: true }
  });

const CarritoModel = mongoose.model('carritos', carritoSchema);

export default CarritoModel;
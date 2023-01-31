import mongoose from "mongoose";

const productosSchema = new mongoose.Schema({
    title: { type: String, required: true },
    price: { type: Number, required: true },
    descripcion: { type: String, required: true },
    categoria: { type: String, required: true },
    thumbnail: { type: String, required: true },
  });

const ProductoModel = mongoose.model('productos', productosSchema);

export default ProductoModel;
import ContenedorMongoDb from "../../contenedores/ContenedorMongoDb.js"
import mongoose from "mongoose";


const productosSchema = new mongoose.Schema({
    title: { type: String, required: true },
    price: { type: Number, required: true },
    thumbnail: { type: String, required: true },
  });


  productosSchema.method('toJSON', function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
 });

  
class ProductosDaoMongoDb extends ContenedorMongoDb {

    constructor() {
        super('productos', productosSchema)
    }
}

export default ProductosDaoMongoDb



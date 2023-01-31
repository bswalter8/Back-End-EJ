import ContenedorMongoDB from "../../containers/ContenedorMongoDB.js";
import ProductoModel from "../../models/ProductoModel.js";
import  config  from "../../config/config.js";

class ProductosDAOMongoDB extends ContenedorMongoDB {
    constructor(){
        super(ProductoModel,config.mongodb.cnxStr, config.mongodb.options);
    }
}

export default ProductosDAOMongoDB;
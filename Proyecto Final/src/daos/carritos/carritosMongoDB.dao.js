import ContenedorMongoDB from "../../containers/ContenedorMongoDB.js";
import CarritoModel from "../../models/CarritoModel.js";
import  config  from "../../config/config.js";

class CarritoDAOMongoDB extends ContenedorMongoDB {
    constructor(){
        super(CarritoModel,config.mongodb.cnxStr, config.mongodb.options);
    }
}

export default CarritoDAOMongoDB;
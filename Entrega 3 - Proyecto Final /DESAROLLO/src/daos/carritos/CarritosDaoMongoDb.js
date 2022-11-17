import ContenedorMongoDB from "../../contenedores/ContenedorMongoDB.js";

export default class CarritoDaoMongoDB extends ContenedorMongoDB {
  constructor() {
    super("carritos", {
     //   id: { type: Number, required: true },
        idUser: { type: String, required: true },
        timestamp: { type: Date, required: true },
        products: { type: Array, required: true }
    });
  }
  
};

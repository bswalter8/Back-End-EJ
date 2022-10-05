import ContenedorMongoDb from "./contenedores/ContenedorMongoDb"

class ChatDaoMongoDB extends ContenedorMongoDb {

    constructor() {
        super('mensajes-Chat', {
            title: { type: String, required: true },
            price: { type: Number, required: true },
            thumbnail: { type: String, required: true },
        })
    }
}

export default ProductosDaoMongoDb
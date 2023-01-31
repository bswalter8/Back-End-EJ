import ContenedorMongoDB from "../../containers/ContenedorMongoDB.js";
import ChatModel from "../../models/ChatModel.js";
import  config  from "../../config/config.js";

class ChatDAOMongoDB extends ContenedorMongoDB {
    constructor(){
        super(ChatModel,config.mongodb.cnxStr, config.mongodb.options);
    }
}

export default ChatDAOMongoDB;
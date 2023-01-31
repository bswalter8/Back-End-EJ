import ContenedorMongoDB from "../../containers/ContenedorMongoDB.js";
import {UserRole} from "../../models/UserModel.js";
import  config  from "../../config/config.js";

class UsersRoleDAOMongoDB extends ContenedorMongoDB {
    constructor(){
        super(UserRole,config.mongodb.cnxStr, config.mongodb.options);
    }
}

export default UsersRoleDAOMongoDB;
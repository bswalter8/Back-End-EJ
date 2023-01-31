import  config  from "../config/config.js";
import CarritoDAOMongoDB from './carritos/carritosMongoDB.dao.js';
import ProductosDAOMongoDB from './productos/productosMongoDB.dao.js';
import UsersRoleDAOMongoDB from './users/usersRoleMongoDB.dao.js';
import ChatDAOMongoDB from  './chats/chatsMongoDB.dao.js';
import logger from '../config/loggers.js'

const Pers = config.server.PERS;

class ContainerDAOFactory {
    static get(tipo) {
        logger.info(`Persistencia ${tipo}: `, Pers);
       
        let Container;
    
        if (tipo === 'Productos'){
            Container = ProductosDAOMongoDB
        }   else if(tipo === 'Carrito') {
            Container = CarritoDAOMongoDB;
        }  else if(tipo === 'UsersRole') {
            Container = UsersRoleDAOMongoDB;
        } else {
            Container = ChatDAOMongoDB;
        }


        switch (Pers) {
            case 'MONGODB':
              
                return new Container();
          /*  case 'MEMORIA':
                return new NoticiasDAOMem();
            case 'FILE':
                return new NoticiasDAOFile();
            
            default:
                return new NoticiasDAOMem();*/
        }
    }
}

export default ContainerDAOFactory;
import  config  from "../config/config.js";
import CarritoDAOMongoDB from './carritosMongoDB.dao.js';
import ProductosDAOMongoDB from './productosMongoDB.dao.js';
import UsersRoleDAOMongoDB from './usersRoleMongoDB.dao.js';
import ChatDAOMongoDB from  './chatsMongoDB.dao.js';

const Pers = config.server.PERS;

class ContainerDAOFactory {
    static get(tipo) {
        console.log(`Persistencia ${tipo}: `, Pers);
       
        let Container;
    
   //     tipo === 'Productos'? Container = ProductosDAOMongoDB: Container = CarritoDAOMongoDB;
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
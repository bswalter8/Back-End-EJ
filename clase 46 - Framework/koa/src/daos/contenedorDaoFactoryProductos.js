
import ContenedorDaoMongoDB from './productos/contenedorDaoMongoDB.js'

import config from '../config/config.js'



//const option = process.argv[2] || 'Mem';


export default class PersonasDaoFactory {
    
    static async getDao(option) {

        let dao;

        switch (option) {
            case 'Mongo':
                dao = new ContenedorDaoMongoDB(config.mongodb.nameProductos, config.mongodb.cnxStr, config.mongodb.options);
                await dao.init();
                break;
            case 'File':
                dao = new ContenedorDaoArchivo(`${config.fileSystem.path}/mensajes.json`);
                await dao.init();
                break;
            case 'MariaDB':
                dao = new ContenedorDaoMariaDB('productos',config.mariaDb);
                await dao.init();
                break;
        /*  default:
                dao = new PersonasDaoMem();*/
        }
        return dao;
    }
}




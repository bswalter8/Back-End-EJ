import ContenedorDaoArchivo from "./contenedorDaoArchivo.js";
import ContenedorDaoMongoDB from './contenedorDaoMongoDB.js'
import ContenedorDaoMariaDB from "./contenedorDaoMariaDB.js";
import config from '../config/config.js'



//const option = process.argv[2] || 'Mem';


export default class PersonasDaoFactory {
    
    static async getDao(option) {

        let dao;

        switch (option) {
            case 'Mongo':
                dao = new ContenedorDaoMongoDB('msg-chat', config.mongodb.cnxStr, config.mongodb.options);
                await dao.init();
                break;
            case 'File':
                dao = new ContenedorDaoArchivo(`${config.fileSystem.path}/mensajes.json`);
                await dao.init();
                break;
            case 'MariaDB':
                dao = new ContenedorDaoMariaDB('Ej16',config.mariaDb);
                await dao.init();
                break;
        /*  default:
                dao = new PersonasDaoMem();*/
        }
        return dao;
    }
}




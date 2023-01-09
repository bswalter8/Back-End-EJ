
import ContenedorCarritoMongoDb from './carritos/contenedorDaoCarritoMongoDB.js'

import config from '../config/config.js'



//const option = process.argv[2] || 'Mem';


export default class CarritosDaoFactory {
    
    static async getDao(option) {

        let dao;

        switch (option) {
            case 'Mongo':
                dao = new ContenedorCarritoMongoDb(config.mongodb.nameCarritos, config.mongodb.cnxStr, config.mongodb.options);
                await dao.init();
                break;
            case 'File':
                dao = new ContenedorCarritoMongoDb(`${config.fileSystem.path}/mensajes.json`);
                await dao.init();
                break;
            case 'MariaDB':
                dao = new ContenedorCarritoMongoDb('Ej16',config.mariaDb);
                await dao.init();
                break;
        /*  default:
                dao = new PersonasDaoMem();*/
        }
        return dao;
    }
}




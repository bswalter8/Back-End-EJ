
import contenedorDaoFactory from '../daos/contenedorDaoFactoryProductos.js'


export default class RepoMensajes {
    #dao

    constructor() {

        return (async () => {
        
            this.#dao = await contenedorDaoFactory.getDao('Mongo');
            
            return this;
            
            })();
        
        }

       
}
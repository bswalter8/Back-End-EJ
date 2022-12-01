
import contenedorDaoFactory from '../daos/contenedorDaoFactory.js'


export default class RepoMensajes {
    #dao

    constructor() {

        return (async () => {
        
            this.#dao = await contenedorDaoFactory.getDao('Mongo');
            
            return this;
            
            })();
        
        }

       
}
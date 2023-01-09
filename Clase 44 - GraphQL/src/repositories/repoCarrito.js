
import CarritosDaoFactory from '../daos/contenedorDaoFactoryCarritos.js'
import { asDto } from '../dtos/mensajeDto.js'
import Mensaje from '../models/mensajesSend.js'
import config from '../config/config.js'

export default class RepoCarrito {
    #dao

   
    constructor() {

        return (async () => {
           // const option = process.argv[4] || 'Mongo';
            const option = config.dataBase.carritos;
            this.#dao = await CarritosDaoFactory.getDao(option);
            
            return this;
            
            })();
        
        }

        async getAll() {
      /*      const productos = await this.#dao.getAll()
           
           const productosDto = productos.map(p =>  new Mensaje(p))*/
    
            return await this.#dao.getAll();
        }
        
        async add(idName) {
            return await this.#dao.add(idName)
         }

        async getById(idBuscado) {
           /* const dto = await this.#dao.getById(idBuscado)
            return new Mensaje(dto)*/
            return await  this.#dao.getById(idBuscado);
        }
    
        async addProducto(product, idName) {

            return await this.#dao.setCart(product, idName);
         }

        
       
        async removeById(idBuscado) {
            const removida = await this.#dao.deleteById(idBuscado)
            return removida
        }
    
        async removeProduct(idName, idProd) {  
            return await this.#dao.deleteProdByCartId(idName, idProd)
        }
}

import contenedorDaoFactory from '../daos/contenedorDaoFactoryProductos.js'
import config from '../config/config.js'
import Producto from '../models/producto.js'
import { asDto } from '../dtos/productoDto.js'

export default class RepoProductos {
    #dao;

    constructor() {

        return (async () => {
            
         //   const option = process.argv[2] || 'Mongo';
            const option = config.dataBase.productos;
            this.#dao = await contenedorDaoFactory.getDao(option);
            
            return this;
            
            })();
        
        }

        async getAll() {
           const productos = await this.#dao.getAll()                 
            return asDto(productos)
        }
    
        async getById(idBuscado) {
            const producto = await this.#dao.getById(idBuscado)
          /*  return new Producto(dto)*/
            return  asDto(producto)
        }
    
        async add(productoNuevo) {
         return    await this.#dao.save(asDto(productoNuevo))
        }

        async set(productoNuevo,productoID) {
            return  await this.#dao.update(asDto(productoNuevo),productoID)
        }

        async removeById(idBuscado) {
           /* const removida = await this.#dao.deleteById(idBuscado)
            return new Producto(removida)*/
            return await this.#dao.deleteById(idBuscado)
        }

        
    
        async removeAll() {
            await this.#dao.deleteAll()
        }
}
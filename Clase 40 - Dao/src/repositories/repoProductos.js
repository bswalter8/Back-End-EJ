
import contenedorDaoFactory from '../daos/contenedorDaoFactory.js'
import Producto from '../models/producto.js'
import { asDto } from '../dtos/productoDto.js'

export default class RepoProductos {
    #dao;

    constructor() {

        return (async () => {
            
            const option = process.argv[2] || 'MariaDB';
            this.#dao = await contenedorDaoFactory.getDao(option);
            
            return this;
            
            })();
        
        }

        async getAll() {
            const productos = await this.#dao.getAll()
            const productosDto = productos.map(p => new Producto(p))
            return productosDto
        }
    
        async getById(idBuscado) {
            const dto = await this.#dao.getById(idBuscado)
            return new Producto(dto)
        }
    
        async add(productoNuevo) {
            await this.#dao.save(asDto(productoNuevo))
        }
    
        async removeById(idBuscado) {
            const removida = await this.#dao.deleteById(idBuscado)
            return new Producto(removida)
        }
    
        async removeAll() {
            await this.#dao.deleteAll()
        }
}
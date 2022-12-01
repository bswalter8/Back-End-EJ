
import contenedorDaoFactory from '../daos/contenedorDaoFactory.js'
import { asDto } from '../dtos/mensajeDto.js'
import Mensaje from '../models/mensajesSend.js'

export default class RepoMensajes {
    #dao

   
    constructor() {

        return (async () => {
            const option = process.argv[3] || 'File';
            this.#dao = await contenedorDaoFactory.getDao(option);
            
            return this;
            
            })();
        
        }

        async getAll() {
            const productos = await this.#dao.getAll()
           
           const productosDto = productos.map(p =>  new Mensaje(p))
      //     console.log(productosDto)
            return productosDto
        }
    
        async getById(idBuscado) {
            const dto = await this.#dao.getById(idBuscado)
            return new Mensaje(dto)
        }
    
        async add(productoNuevo) {
            await this.#dao.save(asDto(productoNuevo))
        }
    
        async removeById(idBuscado) {
            const removida = await this.#dao.deleteById(idBuscado)
            return new Mensaje(removida)
        }
    
        async removeAll() {
            await this.#dao.deleteAll()
        }
}
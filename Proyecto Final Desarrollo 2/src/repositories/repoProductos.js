
import ContainerDAOFactory from '../daos/DaoFactory.js'
import config from '../config/config.js'

import { asDto } from '../dtos/productoDto.js'


const DAO = ContainerDAOFactory.get('Productos');
DAO.init();

export default class RepoProductos {


        async getAll() {
           const productos = await DAO.getAll()                 
            return asDto(productos)
        }
    
        async getById(idBuscado) {
            const producto = await DAO.getById(idBuscado)
         //    const producto = await DAO.getByQuery({_id:idBuscado});
            return  asDto(producto)
        }

        async getByCategoria(cat) {
           const producto = await DAO.getByCat(cat);
         //  const producto = await DAO.getByQuery({categoria:cat});
            return  asDto(producto)
        }


    
        async add(productoNuevo) {
         return    await DAO.save(asDto(productoNuevo))
        }

        async set(productoNuevo,productoID) {
            return  await DAO.update(asDto(productoNuevo),productoID)
        }

        async removeById(idBuscado) {

            return await DAO.deleteById(idBuscado)
        }

        
    
        async removeAll() {
            await DAO.deleteAll()
        }
}
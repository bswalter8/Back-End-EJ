
import ContainerDAOFactory from '../daos/DaoFactory.js'
import { asDto } from '../dtos/carritoDto.js'
import config from '../config/config.js'


const DAO = ContainerDAOFactory.get('Carrito');
DAO.init();


export default class RepoCarrito {

        async getAll() {
            const carritos = await DAO.getAll()                 
            return asDto(carritos)
    
         //   return await DAO.getAll();
        }
        
        async add(idName) {
            const carrito = await DAO.add(idName);                 
            return asDto(carrito)
       //     return await DAO.add(idName)
         }

        async getById(idBuscado) {
            const carrito = await DAO.getById(idBuscado);                 
            return asDto(carrito)
        //    return await  DAO.getById(idBuscado);
        }
    
        async addProducto(product, idName) {

            return await DAO.setCartProduct(product, idName);
         }

         async updateProducto(idName,idProduct, newProduct) {
            return await DAO.updateCartProduct(idName,idProduct, newProduct);          
         }
       
        async removeById(idBuscado) {
            const removida = await DAO.deleteById(idBuscado)
            return removida
        }
    
        async removeProduct(idName, idProd) {  
            return await DAO.deleteProdByCartId(idName, idProd)
        }
}
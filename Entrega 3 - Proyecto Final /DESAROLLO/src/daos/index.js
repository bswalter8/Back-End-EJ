//import { mongo } from 'mongoose'
import dotenv from 'dotenv'


let productosDao;
let carritosDao;


dotenv.config();


switch (process.env.DBNAME)

{
    case 'json':
        const { default: ProductosDaoArchivo } = await import('./productos/ProductosDaoArchivo.js')
        const { default: CarritosDaoArchivo } = await import('./carritos/CarritosDaoArchivo.js')
        console.log('Base de datos Json Conectada'); 
        productosDao = new ProductosDaoArchivo()
        carritosDao = new CarritosDaoArchivo()
        break
    case 'firebase':
         const { default: ProductosDaoFirebase } = await import("./productos/ProductosDaoFirebase.js");
          const { default: CarritosDaoFirebase } = await import("./carritos/CarritosDaoFirebase.js");
          console.log('Base de datos Firebase Conectada');      
          productosDao = new ProductosDaoFirebase();
          carritosDao = new CarritosDaoFirebase();
        break
    case 'mongodb':
        const { default: ProductosDaoMongoDb } = await import('./productos/ProductosDaoMongoDb.js')
        const { default: CarritosDaoMongoDb } = await import('./carritos/CarritosDaoMongoDB.js')
        console.log('Base de datos MongoDB Conectada');
        productosDao = new ProductosDaoMongoDb()
        carritosDao = new CarritosDaoMongoDb()    
        break
    case 'mariadb':
        
        break
    case 'sqlite3':
        
        break
    default:
        
        break
}

export { productosDao, carritosDao }
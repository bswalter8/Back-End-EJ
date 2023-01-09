import { CommentsController } from 'moongose/controller/index.js';
import RepoProductos from '../repositories/repoProductos.js';
import RepoCarrito from '../repositories/repoCarrito.js';


import CustomError from "../errors/CustomError.class.js";

const productosDB = await new RepoProductos();
const carritosDB = await new RepoCarrito();

async function obtenerProducto({id}) {
    const res =  await productosDB.getById(id); 
    return  res
}

 async function obtenerProductos(){
    return  await productosDB.getAll();  
}

async function crearProducto({ datos }) {
    let doc = await productosDB.add(datos);
    return doc;
}

async function updateProducto({ id, datos }) {
    let doc = await productosDB.set(datos,id);
    return doc
}

async function deleteProducto({ id }) {
    let doc = await productosDB.removeById(id);
    return doc;
}


async function obtenerCarrito({id}) {
    const res =  await carritosDB.getById(id); 
    return  res
}

 async function obtenerCarritos(){
    return  await carritosDB.getAll();  
}

async function crearCarrito({ datos }) {
    let doc = await carritosDB.add(datos);
    return doc;
}

async function updateCarrito({ id, datos }) {
    let doc = await carritosDB.set(datos,id);
    return doc
}

async function deleteCarrito({ id }) {
    let doc = await carritosDB.removeById(id);
    return doc;
}



export {obtenerProductos, obtenerProducto,crearProducto,updateProducto,deleteProducto,obtenerCarrito,obtenerCarritos,crearCarrito,updateCarrito,deleteCarrito}


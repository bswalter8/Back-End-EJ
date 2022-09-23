import express from 'express'
import mongoose from 'mongoose';
import * as dotenv from 'dotenv'
//import ContenedorMongoDb  from "./contenedores/ContenedorMongoDb.js";
//import ContenedorFirebase from './contenedores/ContenedorFirebase.js';
const { Router } = express

dotenv.config();

import {
    productosDao as productosApi,
    carritosDao as carritosApi
} from './daos/index.js'




//------------------------------------------------------------------------
// instancio servidor

const app = express()

//--------------------------------------------
// permisos de administrador

const esAdmin = true

function crearErrorNoEsAdmin(ruta, metodo) {
    const error = {
        error: -1,
    }
    if (ruta && metodo) {
        error.descripcion = `ruta '${ruta}' metodo '${metodo}' no autorizado`
    } else {
        error.descripcion = 'no autorizado'
    }
    return error
}

function soloAdmins(req, res, next) {
    if (!esAdmin) {
        res.json(crearErrorNoEsAdmin())
    } else {
        next()
    }
}

//--------------------------------------------
// configuro router de productos 

const productosRouter = new Router()

productosRouter.get('/', async (req, res) => {
    const productosAll = await productosApi.getAll();
    res.send(productosAll);
})

productosRouter.get('/:id', async (req, res) => {
   // const id = Number(req.params.id);
    const respuesta =  await productosApi.getById(req.params.id);
    res.send(respuesta);
})

productosRouter.post('/', soloAdmins, async (req, res) => {
    const respuesta = await productosApi.add(req.body);
    res.send(`Producto guardado ${respuesta}`);
})

productosRouter.put('/:id', soloAdmins, async (req, res) => {
  //  const id = Number(req.params.id);
    const respuesta = await productosApi.set(req.body,req.params.id);
    res.json(respuesta);  
})

productosRouter.delete('/:id', soloAdmins, async (req, res) => {
  //  const id = Number(req.params.id);
   const respuesta = await productosApi.deleteById(req.params.id); 
   res.send(respuesta);
})

//--------------------------------------------
// configuro router de carritos

const carritosRouter = new Router()

carritosRouter.get('/', async (req, res) => {
    const respuesta = await carritosApi.getAll();
    res.send(respuesta);
})

carritosRouter.post('/', async (req, res) => {
    const respuesta = await carritosApi.addCart();
    res.send(JSON.stringify(respuesta));
})

carritosRouter.delete('/:id', async (req, res) => {
  //  const id = Number(req.params.id);
    const respuesta = await carritosApi.deleteById(req.params.id);
    res.send(respuesta);
})

//--------------------------------------------------
// router de productos en carrito

carritosRouter.get('/:id/productos', async (req, res) => {
  //  const id = Number(req.params.id);
    const respuesta = await carritosApi.getCartbyId(req.params.id);
    res.send(JSON.stringify(respuesta));
})

carritosRouter.post('/:id/productos', async (req, res) => {
   // const id = Number(req.params.id);
    const respuesta = await carritosApi.setCart(req.body,req.params.id);
    res.send(respuesta);
})

carritosRouter.delete('/:id/productos/:idProd', async (req, res) => {
  //  const id = Number(req.params.id);
  //  const idProd = Number(req.params.idProd);
    const respuesta = await carritosApi.deteleProdByCartId(req.params.id,req.params.idProd);
    res.send(respuesta);
})

//--------------------------------------------
// configuro el servidor

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))

app.use('/api/productos', productosRouter)
app.use('/api/carritos', carritosRouter)

export default app
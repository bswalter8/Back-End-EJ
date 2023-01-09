import express from 'express';
import {productosRouter} from './productoRouter.js'
import {carritoRouter} from './carritoRouter.js'
import {userRouter} from './userRouter.js'
import {checkAuthentication} from '../middleware/auth.js'


const { Router } = express



//--------------------------------------------
// configuro router de productos 


const apiRouter = new Router();

apiRouter.use('/', userRouter)
apiRouter.use('/api/productos', productosRouter);
apiRouter.use('/api/carritos', checkAuthentication, carritoRouter);


export {apiRouter}

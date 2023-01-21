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
apiRouter.use('/productos', productosRouter);
//apiRouter.use('/carritos', checkAuthentication, carritoRouter);
apiRouter.use('/carritos', carritoRouter);


export {apiRouter}

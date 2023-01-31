import express from 'express';
import {productosRouter} from './productoRouter.js'
import {carritoRouter} from './carritoRouter.js'
import {userRouter} from './userRouter.js'
import serverConfig from '../controllers/serverConfigController.js'

import {checkAuthentication} from '../middleware/auth.js'


const { Router } = express



//--------------------------------------------
// configuro router de productos 


const apiRouter = new Router();


apiRouter.use('/api/server-config', serverConfig)
apiRouter.use('/', userRouter)
apiRouter.use('/productos', productosRouter);
apiRouter.use('/carritos', carritoRouter);



export {apiRouter}

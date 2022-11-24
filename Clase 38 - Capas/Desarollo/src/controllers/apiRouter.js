import express from 'express';
import passport from 'passport';
import {checkAuthentication} from '../middleware/auth.js'
import {productosRouterTest} from './productoRouterTest.js'
import {infoRouter} from './infoRouter.js'
import {productos} from'../services/infoService.js'

import { getRoot,
    redirect,
    getLogin,
    postLogin,
    getFailLogin,
    getLogout,
    getSignUp,
    postSignup,
    getFailsignup} from '../services/loginService.js'
import {socketOn} from '../services/socketService.js'


const { Router } = express

const callBackSocket = (https) =>{
    socketOn(https);
}

//--------------------------------------------
// configuro router de productos 


const apiRouter = new Router();



apiRouter.use('/productos-test', productosRouterTest);
apiRouter.use('/info', infoRouter)


//apiRouter.get('/', callBackSocket(https));


//LOGIN

apiRouter.get('/login', getLogin);

apiRouter.post('/login', passport.authenticate('login', {
    failureRedirect: '/faillogin'
}), postLogin);




apiRouter.get('/faillogin', getFailLogin);



//SIGNUP
apiRouter.get('/signup', getSignUp);
apiRouter.post('/signup', passport.authenticate('signup', {
    failureRedirect: '/failsignup'
}), postSignup);
apiRouter.get('/failsignup',getFailsignup);



apiRouter.get('/productos', checkAuthentication, productos)

//LOGOUT
apiRouter.get('/logout', getLogout);





export {apiRouter, callBackSocket}

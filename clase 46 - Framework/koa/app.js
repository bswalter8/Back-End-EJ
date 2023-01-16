import koa from 'koa';
import { koaBody } from 'koa-body';

import productosRouter from './src/routes/productoRouter.js'
import carritoRouter from './src/routes/carritoRouter.js'
import staticServer from 'koa-static'



import passport from 'passport';

import session from 'express-session';

import {registerStrategy, loginStrategy} from './src/middleware/auth.js'

import config from './src/config/config.js';

const app = new koa();
app.use(koaBody());



app.use(productosRouter.routes());
app.use(carritoRouter.routes())

app.use(passport.initialize());
app.use(passport.session());


app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: config.TIEMPO_EXPIRACION
    }
}));




//---------------- Paspport ------------

passport.use('signup', registerStrategy);
    
passport.use("login", loginStrategy);


app.listen(8080, ()=>{
    console.log('App running http://localhost:8080')
});
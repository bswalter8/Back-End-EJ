import express from 'express'
import knex from 'knex';
import config from './config.js'

import mongoose from 'mongoose';
import { Server as HttpServer } from 'http'
import { Server as Socket } from 'socket.io'
import { Server as IOserver } from 'socket.io'
import { normalize, denormalize, schema } from 'normalizr';
import util from "util"
import session from 'express-session';
import path from 'path';
import MongoStore from 'connect-mongo';
import User from './models.js';
import bCrypt from 'bcrypt';
import { fileURLToPath } from 'url';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import yargs from 'yargs';
import compression from "compression"


//const handlebars = require('express-handlebars');
import handlebars  from 'express-handlebars'
import { upload } from './upoladImg.js';

import {
    productosDao as productosApi,
    carritosDao as carritosApi
} from './daos/index.js'



/*import ContenedorDB from './contenedores/ContenedorDB.js';
import ContenedorMongoDb from './contenedores/ContenedorMongoDb.js';
import ContenedorArchivo from './contenedores/ContenedorArchivo.js';
import MockData from "./contenedores/ContenedorMock.js";

import {createTablaMariaDB} from '../scripts/crearTablas.js'
import {createTablaSQLlite} from '../scripts/crearTablas.js'*/


import  {loggers, loggerWarning,loggerError } from "./logger.js"
//Rutas login
import {
    getRoot,
    redirect,
    getLogin,
    postLogin,
    getFailLogin,
    getLogout,
    getSignUp,
    postSignup,
    getFailsignup,
} from './routes.js'




import controllersdb from './controllersdb.js'
import UserLogIn from './models.js';
import {fork} from 'child_process';

import cluster from 'cluster';
import os from 'os';
import { createSecureServer } from 'http2';

import {sendMailEthereal} from './messenger.js'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const argsConsole = yargs(process.argv.slice(2)).default({
    port: 8080
  }).argv;

const port = argsConsole.port;

const cpus = os.cpus();
const iscluster = process.argv.slice(3)[0] === 'cluster';


//---------------- Paspport ------------

 passport.use('signup', new LocalStrategy({
    passReqToCallback: true
},
     (req, username, password, done) => {
        User.findOne({ 'username': username }, (err, user) => {
            if (err) {
                return done(err);
            };

            if (user) {
                return done(null, false);
            }
      

            const newUser = {
                username: username,
                password: createHash(password),
                email: req.body.email,
                adress: req.body.adress,
                cellphone: req.body.cellphone,
                age: req.body.age,
         //     carritoID : carritoID
         //     avatar: req.body.img.filename
            };

            User.create(newUser, (err, userWithId) => {
                if (err) {
                    return done(err);
                }
                return done(null, userWithId);
            })

            
        });
    }
));



passport.use('login', new LocalStrategy(
    (username, password, done) => {
        User.findOne({ username }, (err, user) => {
            if (err) {
                return done(err);
            }

            if (!user) {
                return done(null, false);
            }

            if (!isValidPassword(user, password)) {
                return done(null, false);
            }

            return done(null, user);
        })
    }
));

passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, done);
});

function createHash(password) {
    return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
}

function isValidPassword(user, password) {
    return bCrypt.compareSync(password, user.password);
}



//--------------------------------------------
// instancio servidor, socket y api
const app = express();
const { Router } = express
const httpServer = new HttpServer(app); 
const io = new IOserver(httpServer); 
const schemaNorma = normalize.schema;





//--------------------------------------------
// configuro router de productos 



const apiRouter = new Router();

const productosRouter = new Router();
const carritosRouter = new Router();




//--------------------------------------------
// agrego middlewares

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))
app.engine(
    'hbs',
    handlebars({
        extname: '.hbs',
        defaultLayout: 'main.hbs' ,
       
        partialsDir:  './views/partials'
    })
);
app.set('view engine', 'hbs');
app.set('views', path.join(process.cwd(), './public/plantillas'));


//--------------------------------------------
// configuro el servidor

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))
//app.use(compression());

//app.use('/', loggers, apiRouter);
//app.get('*', loggerWarning,redirect)

//Check Authentications
function checkAuthentication(req, res, next) {
    if (req.isAuthenticated()) {
   // if (req.isAuthenticated) { 
        next();
    } else {
        res.redirect("/login");
    }
}

//--------------------------------------------
// configuro router de login 


app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: config.TIEMPO_EXPIRACION
    }
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/api/productos', checkAuthentication, productosRouter)
app.use('/api/carritos', carritosRouter)

//LOGIN

//app.use('/', apiRouter);

app.use('/', loggers, apiRouter);
app.get('*', loggerWarning,redirect)


apiRouter.get('/login', getLogin);

apiRouter.post('/login', passport.authenticate('login', {
    failureRedirect: '/faillogin'
}), postLogin);




apiRouter.get('/faillogin', getFailLogin);



//SIGNUP


async function isUploadImg(req, res, next) {
 
    const file = req.file
    if (!file) {
        const error = new Error('Error subiendo archivo')
        console.log(error)
        error.httpStatusCode = 400
        return next()
    }
   next();
}

/*function uploadImg(req,res,next){
    upload.single("img");
   const file = req.file
    if (!file) {
        const error = new Error('Error subiendo archivo')
        error.httpStatusCode = 400
        return next()
    }
    next();
}*/

async function createCart(req, res, next){
    const respuesta = await carritosApi.addCart(req.body.username);
    next();
}

apiRouter.get('/signup', getSignUp);
/*apiRouter.post('/signup', passport.authenticate('signup', {
    failureRedirect: '/failsignup'
}), createCart, upload.single('img'), isUploadImg, postSignup);//Luego del authenticate se carga la imagen. El carrito es creado cuando se crea un nuevo usuario a traves de un middleware
*/

apiRouter.post('/signup', upload.single('img'), isUploadImg, passport.authenticate('signup', {
    failureRedirect: '/failsignup'
}), createCart, postSignup);




apiRouter.get('/failsignup',getFailsignup);



apiRouter.get('/productos', checkAuthentication, (req, res) => {
    const { user } = req;
   // console.log(user);
    res.send('<h1>Ruta OK!</h1>');
});

//LOGOUT
apiRouter.get('/logout', getLogout);

//Checkout

apiRouter.post('/api/checkout', (req,res)=>{

    const body = `
        Nombre: ${req.body.datos.nombre}
        Telefono: ${req.body.datos.phone}
        Productos encargados: ${
            JSON.stringify(req.body.productos)
        }
    `
    sendMailEthereal(req.body.datos.email,`Nuevo pedido de ${req.body.datos.nombre}`, body)
      
});

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
// Router de productos/carrito
//--------------------------------------------
// configuro router de productos 



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



carritosRouter.get('/', async (req, res) => {
    const respuesta = await carritosApi.getAll();
    res.send(respuesta);
})

carritosRouter.post('/', async (req, res) => {
    const respuesta = await carritosApi.addCart();
    res.send(respuesta);
})

carritosRouter.delete('/:id', async (req, res) => {
  //  const id = Number(req.params.id);
    const respuesta = await carritosApi.deleteById(req.params.id);
    res.send(respuesta);
})

//--------------------------------------------------
// router de productos en carrito

/*carritosRouter.get('/:id/productos', async (req, res) => {
  //  const id = Number(req.params.id);
    const respuesta = await carritosApi.getCartbyId(req.params.id);
    res.send(JSON.stringify(respuesta));
})*/


carritosRouter.get('/:idName/productos', async (req, res) => {
      const id = req.params.idName;
      const respuesta = await carritosApi.getCartbyIdName(id);
      res.send(respuesta);
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
// inicio el servidor

const PORT = port;


if(iscluster && cluster.isPrimary)
 {
     cpus.map(() => {
         cluster.fork();
     });

 }else {

    const connectedServer = httpServer.listen(PORT, () => {
        console.log(`Servidor http escuchando en el puerto ${connectedServer.address().port}`)
    })
    connectedServer.on('error', error => console.log(`Error en servidor ${error}`))

 }
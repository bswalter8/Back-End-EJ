
import express from 'express';
//import { Server as IOserver } from 'socket.io'
import passport from 'passport';
import {redirect} from './services/loginService.js'
import yargs from 'yargs';
import session from 'express-session';
import path from 'path';
import { fileURLToPath } from 'url';
import { Server as HttpServer } from 'http'
import {loggers, loggerWarning, loggerError } from './logger/logger.js'
import handlebars  from 'express-handlebars'
import {apiRouter, callBackSocket} from './controllers/apiRouter.js'
import {registerStrategy, loginStrategy} from './middleware/auth.js'
import cluster from 'cluster';
import os from 'os';
import config from './config/config.js';
//import {socketOn} from './controllers/socket.js'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const argsConsole = yargs(process.argv.slice(2)).default({
    port: 8080
  }).argv;

const port = argsConsole.port;

const cpus = os.cpus();
const iscluster = process.argv.slice(3)[0] === 'cluster';




//--------------------------------------------
// instancio servidor, socket y api

const app = express();
const httpServer = new HttpServer(app); 
//const io = new IOserver(httpServer); 



//---------------- Paspport ------------

passport.use("register", registerStrategy);
passport.use("login", loginStrategy);



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
app.set('views', path.join(process.cwd(), './src/views'));


//--------------------------------------------
// configuro el servidor

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))




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

//app.get('/api/randoms', getCalc);
app.use('/', loggers, apiRouter);
app.get('*', loggerWarning,redirect);




//--------------------------------------------
// inicio el servidor

const PORT = port;

callBackSocket(httpServer);


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
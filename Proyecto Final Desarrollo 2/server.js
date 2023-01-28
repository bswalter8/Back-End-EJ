
import express from 'express';
import passport from 'passport';
import {redirect} from './src/controllers/loginController.js'
import yargs from 'yargs';
import session from 'express-session';
import path from 'path';
import { fileURLToPath } from 'url';
import { Server as HttpServer } from 'http'
//import {loggers, loggerWarning, loggerError } from './src/logger/logger.js'
import logger from './src/config/loggers.js'
import handlebars  from 'express-handlebars'
import {apiRouter} from './src/routes/apiRouter.js'
import {registerStrategy, loginStrategy} from './src/middleware/auth.js'
import cluster from 'cluster';
import os from 'os';
import config from './src/config/config.js';
import {socketOn} from "./src/controllers/socketController.js"
import { Strategy as LocalStrategy } from 'passport-local';
import cors from 'cors'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
/*const argsConsole = yargs(process.argv.slice(2)).default({
    port: 8080
  }).argv;*/



const cpus = os.cpus();
const iscluster = process.argv.slice(3)[0] === 'cluster';

//---------------- Paspport ------------

passport.use('signup', registerStrategy);
    
passport.use("login", loginStrategy);



//--------------------------------------------
// instancio servidor, socket y api

const app = express();
const httpServer = new HttpServer(app); 
//const io = new IOserver(httpServer); 



//--------------------------------------------
// agrego middlewares


/*app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method"
    );
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
    res.header("Allow", "GET, POST, OPTIONS, PUT, DELETE");
    next();
  });*/
app.use(cors());



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
app.set('view engine', 'ejs');
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


/*app.use('/', loggers, apiRouter);
app.get('*', loggerWarning,redirect);*/



//--------------------------------------------
// inicio el servidor

const PORT = config.server.PORT;


if(iscluster && cluster.isPrimary)
 {
     cpus.map(() => {
         cluster.fork();
     });

 }else {

    const connectedServer = httpServer.listen(PORT, () => {
        logger.info(`Servidor http en modo ${config.server.NODE_ENV} escuchando en el puerto ${PORT}`)
    })
    connectedServer.on('error', error =>  logger.error(`Error en servidor ${error}`))
    socketOn(httpServer);
    
   

 }
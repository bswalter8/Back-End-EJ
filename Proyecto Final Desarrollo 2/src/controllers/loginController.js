import path from 'path';
import process from 'process';
import RepoCarrito from '../repositories/repoCarrito.js';
import jwt from 'jsonwebtoken';
import  config  from "../config/config.js";


const KEY = config.PRIVATE_KEY;
const carritoDB = await new RepoCarrito();

function getRoot(req, res) {
    res.send('Bienvenido');
}

const redirect = (req, res) => {
    res.redirect('/login')
 }

function getLogin(req, res) {
    if (req.isAuthenticated()) { 
        let user = req.user;
        const access_token = generateToken(user)
        res.json({ access_token }) 
    /*   res.render('login-ok', {
            usuario: user.username,
            nombre: user.firstName,
            apellido: user.lastName,
            email: user.email
        });
 */
      //  res.sendFile(path.join(process.cwd(), '../public/productos.html'));
    }
    else {
       res.sendFile(path.join(process.cwd(), './public/login.html'));
     
    }
}

function getSignUp(req, res) {
    res.sendFile(path.join(process.cwd(), './public/signup.html'));
}


function postLogin(req, res) {
    const user = req.user;
   // console.log(user);
   // res.sendFile(path.join(process.cwd(), './public/index.html'));
   const access_token = generateToken(user)
    res.json({ access_token }) 
}

function postSignup(req, res) {
 /*   const user = req.user;
    console.log(user);
    res.sendFile(path.join(process.cwd(), './public/index.html'));*/
    res.status(500).json({
        Mensaje: 'Usuario creado exitosamente',
      })
}

function getFailLogin(req, res) {
    console.log('error en login');
    res.sendFile(path.join(process.cwd(), './public/login-fail.html'));
    res.render('login-error', {
    });
}

function getFailsignup(req, res) {
    console.log('error en signup');
  /*  res.render('signup-error', {
    });*/
    res.sendFile(path.join(process.cwd(), './public/signup.html'));
}


function getLogout(req, res) {
    req.logout((err) => {
        if (err) { return next(err); }
        res.sendFile(path.join(process.cwd(), './public/index.html'));
    });
}

  async  function createCart(req, res, next){
    const respuesta = await carritoDB.add(req.body.username);
    next();
}

 async function isUploadImg  (req, res, next) {

    const file = req.file
    if (!file) {
        const error = new Error('Error subiendo archivo')
        console.log(error)
        error.httpStatusCode = 400
        return next()
    }
   next();
}

function generateToken(user) {
    const token = jwt.sign({ data: user }, KEY, { expiresIn: '24h' });
    return token;
  }


  function auth(req, res, next) {
    const authHeader = req.headers["authorization"] || req.headers["Authorization"] || '';
   // console.log('req.headers',req.headers)
   // console.log('Authheader', authHeader)
    
    if (!authHeader) {
      return res.status(401).json({
        error: 'se requiere autenticacion para acceder a este recurso',
        detalle: 'no se encontró token de autenticación'
      })
    }
  
    const token = authHeader.split(' ')[1]
  //  console.log(token)
    if (!token) {
      return res.status(401).json({
        error: 'se requiere autenticacion para acceder a este recurso',
        detalle: 'formato de token invalido!'
      })
    }
  
    try {
      req.user = jwt.verify(token, KEY);
    } catch (ex) {
      return res.status(403).json({
        error: 'token invalido',
        detalle: 'nivel de acceso insuficiente para el recurso solicitado'
      })
    }
    next();
  }



export {
    getRoot,
    redirect,
    getLogin,
    postLogin,
    getFailLogin,
    getLogout,
    getSignUp,
    postSignup,
    getFailsignup,
    createCart,
    isUploadImg,
    auth
}
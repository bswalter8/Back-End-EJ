import path from 'path';
import process from 'process';
import RepoUsers from '../repositories/repoLogin.js';
import RepoCarrito from '../repositories/repoCarrito.js';
import jwt from 'jsonwebtoken';
import  config  from "../config/config.js";

//import User from "../models/UserModel.js";

const KEY = config.PRIVATE_KEY;
const userRoleDB = await new RepoUsers();
const carritoDB = await new RepoCarrito();

/*function getRoot(req, res) {
    res.send('Bienvenido');
}*/

const redirect = (req, res) => {
    res.redirect('/login')
 }

/*function getLogin(req, res) {
    if (req.isAuthenticated()) { 
        let user = req.user;
        const access_token = generateToken(user)
        res.json({ token: access_token,
                  user: user   }) 
    /*   res.render('login-ok', {
            usuario: user.username,
            nombre: user.firstName,
            apellido: user.lastName,
            email: user.email
        });
 
      //  res.sendFile(path.join(process.cwd(), '../public/productos.html'));
    }
    else {
       res.sendFile(path.join(process.cwd(), './public/login.html'));
     
    }
}*/

/*function getSignUp(req, res) {
    res.sendFile(path.join(process.cwd(), './public/signup.html'));
}
*/

function postLogin(req, res) {
    const user = req.user;
   // console.log(user);
   // res.sendFile(path.join(process.cwd(), './public/index.html'));
   const access_token = generateToken(user);
   const newUser = {
        id: req.user._id,
        username: req.user.username,
        email: req.user.email,
        address: req.user.address,
        cellphone: req.user.cellphone,
        age: req.user.age
   }
   res.status(200).json({ token: access_token,
          user: newUser   }) 
}

function postSignup(req, res) {
 /*   const user = req.user;
    console.log(user);
    res.sendFile(path.join(process.cwd(), './public/index.html'));*/
    res.status(200).json({
        Mensaje: 'Usuario creado exitosamente',
      })
}



function getFailLogin(req, res) {
    res.status(401).json({
        Mensaje: 'Usuario o contraseña incorrecta',
      })
   /* res.sendFile(path.join(process.cwd(), './public/login-fail.html'));
    res.render('login-error', {
    });*/
}

/*function getFailsignup(req, res) {
    console.log('error en signup');

    res.sendFile(path.join(process.cwd(), './public/signup.html'));
}

/*function getLogout(req, res) {
    req.logout((err) => {
        if (err) { return next(err); }
        res.sendFile(path.join(process.cwd(), './public/index.html'));
    });
}*/

  async  function createCart(req, res, next){
   // console.log(req.user)
    const respuesta = await carritoDB.add(req.user);
    next();
}


async  function createUserRole(req, res, next){
   const newUser = {
        userName: req.body.username, 
        role : 'user'
   }
    const respuesta = await userRoleDB.createRole(newUser);

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

    
    if (!authHeader) {
      return res.status(401).json({
        error: 'se requiere autenticacion para acceder a este recurso',
        detalle: 'no se encontró token de autenticación'
      })
    }
  
    const token = authHeader.split(' ')[1]

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

  async function soloAdmins(req, res, next) {
    console.log(req.user.data.username)
      const user = await userRoleDB.getUserRole(req.user.data.username);
      if (user.role === 'user'){
        return res.status(401).json({
            error: 'se requiere autenticacion  de admin para acceder a este recurso',
            detalle: 'credencial invalida. Anda pa lla bobo!!'
          })
      } 
      next();
  }

    async function checkAdmin(req,res){
      return res.status(200).json({
        detalle: 'Oh la la Monsieur Admin'
      })
    }


export {
   // getRoot,
    redirect,
  //  getLogin,
    postLogin,

    getFailLogin,
//    getLogout,
 //   getSignUp,
    postSignup,
  //  getFailsignup,
    createCart,
    createUserRole,
    isUploadImg,
    auth,
    soloAdmins,
    checkAdmin
}
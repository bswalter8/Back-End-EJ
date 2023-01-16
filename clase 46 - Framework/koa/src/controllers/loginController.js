import path from 'path';
import process from 'process';
import RepoCarrito from '../repositories/repoCarrito.js';




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
   
       res.render('login-ok', {
            usuario: user.username,
            nombre: user.firstName,
            apellido: user.lastName,
            email: user.email
        });
 
      //  res.sendFile(path.join(process.cwd(), '../public/productos.html'));
    }
    else {
       res.sendFile(path.join(process.cwd(), '../public/login.html'));
     
    }
}

function getSignUp(req, res) {
    res.sendFile(path.join(process.cwd(), '../public/signup.html'));
}


function postLogin(req, res) {
    const user = req.user;
    console.log(user);
    res.sendFile(path.join(process.cwd(), '../public/index.html'));
}

function postSignup(req, res) {
    const user = req.user;
    console.log(user);
    res.sendFile(path.join(process.cwd(), '../public/index.html'));
}

function getFailLogin(req, res) {
    console.log('error en login');
    res.sendFile(path.join(process.cwd(), '../public/login-fail.html'));
    res.render('login-error', {
    });
 
}

function getFailsignup(req, res) {
    console.log('error en signup');
  /*  res.render('signup-error', {
    });*/
    res.sendFile(path.join(process.cwd(), '../public/signup.html'));
}


function getLogout(req, res) {
    req.logout((err) => {
        if (err) { return next(err); }
        res.sendFile(path.join(process.cwd(), '../public/index.html'));
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
    isUploadImg
}
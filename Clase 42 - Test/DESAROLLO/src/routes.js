import path from 'path';
import { fork } from 'child_process';
import { cpus } from "os";
import { stringify } from 'querystring';
import {sendMailEthereal} from './messenger.js'


function getRoot(req, res) {
    res.send('Bienvenido');
}

const redirect = (req, res) => {
    res.redirect('/login')
 }




function getLogin(req, res) {
    if (req.isAuthenticated()) {
  //  if (req.isAuthenticated) {  
        let user = req.user;
       res.render('login-ok', {
            usuario: user.username,
            nombre: user.username,
            phone: user.cellphone,
            email: user.email
        });
 
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
    console.log(user);
    res.sendFile(path.join(process.cwd(), './public/index.html'));
}

function postSignup(req, res) {
    const user = req.user;
    
    const body = `
        Nombre: ${user.username}
        Telefono: ${user.cellphone}
        Email:  ${user.email},
        Edad:  ${user.age},
    `
    console.log(user);
    sendMailEthereal('lucy.kuvalis57@ethereal.email',`Nuevo usuario registrado`, body)
    res.sendFile(path.join(process.cwd(), './public/index.html'));
}

function getFailLogin(req, res) {
    console.log('error en login');
    res.sendFile(path.join(process.cwd(), './public/login-fail.html'));
    res.render('login-error', {
    });
 
}

function getFailsignup(req, res) {
    console.log('error en signup');
    res.render('signup-error', {
    });
}


function getLogout(req, res) {
    req.logout((err) => {
        if (err) { return next(err); }
        res.sendFile(path.join(process.cwd(), './public/index.html'));
    });
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
}
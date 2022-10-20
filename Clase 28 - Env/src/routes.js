import path from 'path';
import { fork } from 'child_process';
import { stringify } from 'querystring';

const forked = fork('./randoms.js');

function getRoot(req, res) {
    res.send('Bienvenido');
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
 
      //  res.sendFile(path.join(process.cwd(), './public/productos.html'));
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
        res.sendFile(path.join(process.cwd(), '../public/index.html'));
    });
}

const getInfo = async (req, res) => {
    res.json({
        Argumentos_de_entrada: process.argv,
        Nombre_de_la_plataforma: process.platform,
        Versión_de_node: process.version,                                               
        Memoria_total_reservada: process.memoryUsage(),
        Carpeta_del_proyecto: process.cwd(),
        Process_id: process.pid,
        Path_de_ejecución: process.execPath
    })
}


const getCalc = (req, res) => {
    const cant = req.query.cant ? Number(req.query.cant) : 0;
        console.log(cant)
      forked.send({mensaje: cant})  
      forked.on('message', msg => {
        const num = JSON.stringify(msg)
        res.end(num);

    })
    
}


export {
    getRoot,
    getLogin,
    postLogin,
    getFailLogin,
    getLogout,
    getSignUp,
    postSignup,
    getFailsignup,
    getInfo,
    getCalc
}
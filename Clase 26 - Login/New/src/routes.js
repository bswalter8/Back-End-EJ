import path from 'path';

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
    console.log(user);
    res.sendFile(path.join(process.cwd(), './public/index.html'));
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
        res.sendFile(path.join(process.cwd(), './public/index.html'));
    });
}
export {
    getRoot,
    getLogin,
    postLogin,
    getFailLogin,
    getLogout,
    getSignUp,
    postSignup,
    getFailsignup
}
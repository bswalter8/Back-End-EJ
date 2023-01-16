
import { Strategy as LocalStrategy } from 'passport-local';
import passport from 'passport';
import User from '../models/models.js';
import bCrypt from 'bcrypt';



const registerStrategy =    new LocalStrategy({
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
           //      avatar: req.body.img.filename
            };

            User.create(newUser, (err, userWithId) => {
                if (err) {
                
                    return done(err);
                }
                return done(null, userWithId);
            })

            
        });
    }
);

const loginStrategy =  new LocalStrategy(
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
);


function createHash(password) {
    return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
}

function isValidPassword(user, password) {
    return bCrypt.compareSync(password, user.password);
}

function checkAuthentication(req, res, next) {
    if (req.isAuthenticated()) { 
        next();
    } else {
         res.redirect("/login");
       //res.send('No tiene permiso')
    }
}

passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, done);
});


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


export {registerStrategy, loginStrategy, checkAuthentication}
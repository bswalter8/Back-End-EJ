
import express  from 'express';
import exphbs from 'express-handlebars';
import session from 'express-session';
import path from 'path';
import MongoStore from 'connect-mongo';
import { fileURLToPath } from 'url';

const usuarios = [];

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const mongoOptions = { useNewUrlParser: true, useUnifiedTopology: true }

app.use(session({
    store:MongoStore.create({ mongoUrl: 'mongodb+srv://kind59:H1Xm53ciKkBDdui2@cluster0.k5efrwt.mongodb.net/test', mongoOptions }),
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 60000
    }
}));

app.engine('.hbs', exphbs({ extname: '.hbs', defaultLayout: 'main.hbs' }));
app.set('view engine', '.hbs');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

//Registro
/*app.get('/register', (req, res) => {
    res.sendFile(__dirname + '/views/register.html');
});

app.post('/register', (req, res) => {
    const { nombre } = req.body;
 /*   const usuario = usuarios.find(usuario => usuario.nombre == nombre);

    if (usuario) {
        return res.render('register-error');
    }

    usuarios.push({ nombre });
    res.redirect('/login');
});*/

//Login
app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/views/login.html');
});

app.post('/login', (req, res) => {
    
    const { nombre } = req.body;

    req.session.nombre = nombre;
    req.session.contador = 0;
    res.redirect('/datos');
});

app.get('/datos', (req, res) => {
    if (req.session.nombre) {
        req.session.contador++;
        res.render('datos', {
            nombre: req.session.nombre,
            contador: req.session.contador
        })
    } else {
        res.redirect('/login');
    }
});

app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        res.redirect('/login');
    });
});

app.get('/', (req, res) => {
    
    if (req.session.nombre) {
        res.redirect('/datos');
    } else {
        res.redirect('/login');
    }
});

app.listen(8080);
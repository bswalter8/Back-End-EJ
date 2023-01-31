
import RepoUsers from "../repositories/repoLogin.js";
import RepoCarrito from "../repositories/repoCarrito.js";
import jwt from "jsonwebtoken";
import config from "../config/config.js";
import logger from "../config/loggers.js";

const KEY = config.PRIVATE_KEY;
const userRoleDB = await new RepoUsers();
const carritoDB = await new RepoCarrito();

const redirect = (req, res) => {
  res.redirect("/login");
};

function postLogin(req, res) {
  const user = req.user;

  const access_token = generateToken(user);
  const newUser = {
    id: req.user._id,
    username: req.user.username,
    email: req.user.email,
    address: req.user.address,
    cellphone: req.user.cellphone,
    age: req.user.age,
  };
  res.status(200).json({ token: access_token, user: newUser });
}

function postSignup(req, res) {
  res.status(200).json({
    Mensaje: "Usuario creado exitosamente",
  });
}

function getFailLogin(req, res) {
  res.status(401).json({
    Mensaje: "Usuario o contraseña incorrecta",
  });
}

async function createCart(req, res, next) {
  const respuesta = await carritoDB.add(req.user);
  next();
}

async function createUserRole(req, res, next) {
  const newUser = {
    userName: req.body.username,
    role: "user",
  };
  const respuesta = await userRoleDB.createRole(newUser);

  next();
}

async function isUploadImg(req, res, next) {
  const file = req.file;
  if (!file) {
    const error = new Error("Error subiendo archivo");
    logger.error(error);
    error.httpStatusCode = 400;
    return next();
  }
  next();
}

function generateToken(user) {
  const token = jwt.sign({ data: user }, KEY, { expiresIn: "24h" });
  return token;
}

function auth(req, res, next) {
  const authHeader =
    req.headers["authorization"] || req.headers["Authorization"] || "";

  if (!authHeader) {
    return res.status(401).json({
      error: "se requiere autenticacion para acceder a este recurso",
      detalle: "no se encontró token de autenticación",
    });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      error: "se requiere autenticacion para acceder a este recurso",
      detalle: "formato de token invalido!",
    });
  }

  try {
    req.user = jwt.verify(token, KEY);
  } catch (ex) {
    return res.status(403).json({
      error: "token invalido",
      detalle: "nivel de acceso insuficiente para el recurso solicitado",
    });
  }
  next();
}

async function soloAdmins(req, res, next) {

  const user = await userRoleDB.getUserRole(req.user.data.username);
  if (user.role === "user") {
    return res.status(401).json({
      error: "se requiere autenticacion  de admin para acceder a este recurso",
      detalle: "credencial invalida. Anda pa lla bobo!!",
    });
  }
  next();
}

async function checkAdmin(req, res) {
  return res.status(200).json({
    detalle: "Oh la la Monsieur Admin",
  });
}

export {
  redirect,
  postLogin,
  getFailLogin,
  postSignup,
  createCart,
  createUserRole,
  isUploadImg,
  auth,
  soloAdmins,
  checkAdmin,
};

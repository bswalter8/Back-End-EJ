import CustomError from "../models/CustomMsg.class.js";
import RepoProductos from "../repositories/repoProductos.js";
import { upload } from "../middleware/upoladImg.js";
import logger from "../config/loggers.js";

const productosDB = await new RepoProductos();

class ProductoController {
  obtenerProductos = async (req, res) => {
    try {
      let docs = await productosDB.getAll();

      res.json(docs);
    } catch (error) {
      throw new CustomError(500, "Error en Metodo obtenerProductos", error);
    }
  };

  obtenerCategoria = async (req, res) => {
    try {
      let docs = await productosDB.getByCategoria(req.params.cat);

      res.json(docs);
    } catch (error) {
      throw new CustomError(500, "Error en Metodo obtenerProductos", error);
    }
  };

  obtenerProducto = async (req, res) => {
    try {
      let docs = await productosDB.getById(req.params.id);

      res.json({ metodo: "Metodo obtener Producto por ID", data: docs });
    } catch (error) {
      throw new CustomError(500, "Error en Metodo obtenerProducto", error);
    }
  };

  guardarProducto = async (req, res) => {
    try {
      let doc = await productosDB.add(req.body);
      res.json({ metodo: "Metodo guardar Producto", data: { ...doc } });
    } catch (error) {
      throw new CustomError(500, "Error en Metodo guardarProducto", error);
    }
  };

  borrarProducto = async (req, res) => {
    try {
      let doc = await productosDB.removeById(req.params.id);
      res.json({ metodo: "Metodo borrar Producto", data: { ...doc } });
    } catch (error) {
      throw new CustomError(500, "Error en Metodo borrarProducto", error);
    }
  };

  actualizarProducto = async (req, res) => {
    try {
      let doc = await productosDB.set(req.body, req.params.id);
      res.json({ metodo: "Metodo actualizaNoticia", data: { ...doc } });
    } catch (error) {
      throw new CustomError(500, "Error en Metodo actualizarProducto", error);
    }
  };

  guardarImg = async (req, res) => {
    try {
      upload.single("image");
      logger.info("imagen guardada con exito");
    } catch (error) {
      throw new CustomError(500, "Error en Metodo actualizarProducto", error);
    }
  };
}

export default ProductoController;

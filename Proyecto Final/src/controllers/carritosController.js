import logger from "../config/loggers.js";
import CustomError from "../models/CustomMsg.class.js";
import RepoCarrito from "../repositories/repoCarrito.js";
import sendMailEthereal from "../middleware/messenger.js";

const carritoDB = await new RepoCarrito();

class CarritoController {
  obtenerCarritos = async (req, res) => {
    try {
      let docs = await carritoDB.getAll();

      res.json({ metodo: "Metodo obtener carritos", data: docs });
    } catch (error) {
      throw new CustomError(500, "Error en Metodo obtenerProductos", error);
    }
  };

  crearCarrito = async (req, res) => {
    try {
      let docs = await carritoDB.add(req.body.username); //Temporario luego lo crea al crearse nuevo usuario

      res.json({ metodo: "Carrito creado", id: docs });
    } catch (error) {
      throw new CustomError(500, "Error en Metodo obtenerProducto", error);
    }
  };

  obtenerCarrito = async (req, res) => {
    try {
      let docs = await carritoDB.getById(req.params.id); //ID es el nombre de usuario
      res.json({ metodo: "Metodo obtener carritos por ID", data: docs });
    } catch (error) {
      throw new CustomError(500, "Error en Metodo obtenerProductos", error);
    }
  };

  borrarCarrito = async (req, res) => {
    try {
      let docs = await carritoDB.removeById(req.params.id);

      res.json({ metodo: "Carrito borrado", id: docs });
    } catch (error) {
      throw new CustomError(500, "Error en Metodo obtenerProducto", error);
    }
  };

  guardarProductoCarrito = async (req, res) => {
    try {
      let doc = await carritoDB.addProducto(req.body, req.params.id);
      res.json({ metodo: "Producto agregado al carrito", data: { ...doc } });
    } catch (error) {
      console.log(error);
      throw new CustomError(500, "Error en Metodo guardarProducto", error);
    }
  };

  borrarProducto = async (req, res) => {
    try {
      let doc = await carritoDB.removeProduct(req.params.id, req.params.idProd);
      res.json({
        metodo: "Metodo borrar Producto del carrito",
        data: { ...doc },
      });
    } catch (error) {
      throw new CustomError(500, "Error en Metodo borrarProducto", error);
    }
  };

  actualizarProducto = async (req, res) => {
    try {
      let doc = await carritoDB.updateProducto(
        req.params.id,
        req.params.idProd,
        req.body
      );
      res.json({ metodo: "Metodo actualizar producto", data: { doc } });
    } catch (error) {
      throw new CustomError(500, "Error en Metodo actualizarProducto", error);
    }
  };

  checkOutPost = async (req, res) => {
    const mail = `
            Nombre: ${req.body.nombre}
            Email: ${req.body.email}
            Fecha del encargo: ${new Date(Date.now())}
            Productos encargados: ${JSON.stringify(req.body.productos)}
        `;

    sendMailEthereal(req.body.email, `Su pedido ha sido emitido`, mail); // Mail a user
    sendMailEthereal(
      "bswalter8@gmail.com",
      `Nuevo pedido de ${req.body.nombre}`,
      mail
    ); // Mail a tienda

    try {
      let doc = await carritoDB.removeAllProducts(req.params.id);
      res.json({
        metodo: "Metodo borrar productos del carrito",
        data: { doc },
      });
    } catch (error) {
      throw new CustomError(500, "Error en Metodo checkout", error);
    }
  };
}

export default CarritoController;

import { buildSchema, GraphQLString } from 'graphql';


const ProductoSchema = buildSchema(`
  input ProductoInput {
    title: String,
    price: String,
    thumbnail: String,
    descripcion:  String, 
    categoria: String, 
  }
  type Producto {
    id: ID!,
    title: String,
    price: String,
    thumbnail: String,
  }
  type Query {
    obtenerProductos: [Producto],
    obtenerProducto(id: ID!): Producto
  }
  type Mutation {
    crearProducto(datos: ProductoInput): Producto,
    updateProducto(id: ID!, datos: ProductoInput): Producto,
    deleteProducto(id: ID!): Producto,
  }
`);

const CarritoSchema = buildSchema(`
  input CarritoInput {
    idUser: String,
    timestamp:  String, 
   
  }
  type Carrito {
    idUser: String,
    timestamp:  String, 
    
  }
  type ProductoCarrito {
    id: ID!,
    title: String,
    price: String,
    thumbnail: String,
  }
  type Query {
    obtenerCarritos: [Carrito],
    obtenerCarrio(idUser: String!): Carrito
  }
  type Mutation {
    crearCarrito(datos: CarritoInput): Carrito,
    updateCarrito(idUser: String!, datos: CarritoInput): Carrito,
    deleteCarrito(idUser: String!): Carrito,
  }
`);





export  {ProductoSchema, CarritoSchema}

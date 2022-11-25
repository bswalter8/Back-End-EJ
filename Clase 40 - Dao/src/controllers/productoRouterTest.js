import express from 'express';

import {mockData}   from '../services/mockService.js'

const { Router } = express;
const productosRouterTest = new Router();

productosRouterTest.get('/', mockData)

export {productosRouterTest}
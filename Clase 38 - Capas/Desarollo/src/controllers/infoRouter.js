import express from 'express';
import { getInfo,
    getInfoWithConsoleLog,
    getCalc} from '../services/infoService.js'

const { Router } = express

const infoRouter = new Router();


infoRouter.get('/', getInfo);
infoRouter.get('/console', getInfoWithConsoleLog);

export {infoRouter}
import express from 'express';
import { getInfo,
    getInfoWithConsoleLog,
    getCalc} from '../contollers/infoService.js'

const { Router } = express

const infoRouter = new Router();


infoRouter.get('/', getInfo);
infoRouter.get('/console', getInfoWithConsoleLog);

export {infoRouter}
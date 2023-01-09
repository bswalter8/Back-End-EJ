import winston from 'winston';

 const logger = winston.createLogger({
     level: 'warn',
     transports : [
         new winston.transports.Console({ level:'verbose' }),
         new winston.transports.File({ filename: 'warning.log', level:'warn' }),
         new winston.transports.File({ filename: 'error.log', level:'error' }),
     ]
  })

 const loggers = (req, res, next) => {
        const metodo = req.method;
        const url =  req.url;
        logger.log('info', req.method);
        logger.log('info', req.url);
     
     next();
 };

 const loggerWarning = (req, res, next) => {
     const metodo = req.method;
     const url =  req.url;
     logger.log('warn', req.method);
     logger.log('warn', req.url);
  next();
 };

 const loggerError = (err) => {
    const error = err;
    logger.log('error', error);
};


 export {loggers, loggerWarning, loggerError }
import "dotenv/config";
import config from "../config/config.js";
import path from "path";


const serverConfig = (req, res) => {
  try {
    const configServer = {
        port: config.server.PORT,
        server: config.server.NODE_ENV,
        pers: config.server.PERS,  
        email: config.server.EMAIL
    };
    res.render(path.join(process.cwd(), "./src/views/server-config.ejs"), {
      configServer
    });
   
  } catch (error) {
    console.log(`se produjo el siguiente error: ${error}`);
    res.sendStatus(500);
  }
};

export default serverConfig;
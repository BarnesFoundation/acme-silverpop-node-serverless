import { Config } from '../utils/config';
import { Server } from './server';

 
const port = Config.port;
const apiRootUrl = Config.apiRootUrl;

const server = new Server().express;

server.listen(port, (error) => {

    if (error) { return console.log(error); } 

    console.log(`Server is listening on ${port}`);
    console.log(`API root url is ${apiRootUrl}` )
});

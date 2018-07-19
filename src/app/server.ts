import express from 'express';

class Server {

    /** Properties  */

    public express;

    /** Constructor */

    constructor() {
        this.express = express();
    }

}

export { Server };

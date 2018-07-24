import { main } from './src/app/app';

const exec = require('child_process').exec;

exports.handler = async (event) => {

    let command = 'node -r ./tsconfig-paths-bootstrap.js src/app/app.js';

    exec(command, function (error, stdout, stderr) {

        if (stderr || error) {
            console.log(error);
        } else {
            console.log(`stdout: ${stdout}`);
        }
    });
}

exports.handler();
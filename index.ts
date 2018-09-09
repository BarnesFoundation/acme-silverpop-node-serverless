require('./tsconfig-paths-bootstrap'); 

import { main } from '@app/app';

exports.handler = async (event) => {

    main();
}
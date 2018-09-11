import { APIGatewayEvent, Callback, Context, Handler } from 'aws-lambda';
import { main } from './src/app/app';

export const hello: Handler = (event: APIGatewayEvent, context: Context, cb: Callback) => {
  
  console.log('Executing reports');

  main();
}


## ACME Silverpop Node
This project is a rewrite of the existing *ACME Silverpop* project from C# into NodeJS, with enforced typings using TypeScript.

## Installation 

 1. Ensure  `npm` is installed on the workstation 
 2. Download and extract the repository into your local development workspace
 3. Run `npm install`to install application dependencies (this will install both production and development dependencies)
 4. More to come...


## Development
While developing, do the following
 1. Use the `tsc -w` command in the local terminal <br/>
   - This tells the TypeScript compiler to watch files with the *.ts* extension and compiles them to JavaScript when a save is executed

 2. Open another terminal and run the `nodemon` command <br/>
   - This starts the NodeJS Server (a TypeScript implementation) with *app.ts* being executed. The server will automatically restart after a save is executed for the files located under the *src/* directory
 

 


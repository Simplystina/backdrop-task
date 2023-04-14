const {connect} = require("./Database")
const {server, app} = require("./app")
require("dotenv").config()


const PORT = process.env.PORT || 3334
connect()


async function startServer() {
    await server.start(); // Wait for the server to start before applying middleware
   
    server.applyMiddleware({ app, path: '/graphql' });
    app.listen({ port: PORT }, () => {
      console.log(`🚀 Server ready at http://localhost:4000/graphql`);
    });
}
  
startServer();


/*app.listen(PORT, ()=>{
    console.log("Server is listening at ",PORT)
 }) */
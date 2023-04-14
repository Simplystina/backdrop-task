const express = require("express")
const cors = require("cors")

const jwt = require("jsonwebtoken")

const bodyParser = require("body-parser")

const { ApolloServer, AuthenticationError } = require('apollo-server-express')

require("dotenv").config()

//import Routers
//const authRouter = require("./Router/auth")
//const bankRouter = require("./Router/bank")
const resolvers = require("./Schemas/resolvers")
const typeDefs = require("./Schemas/typeDefs")


  

const server = new ApolloServer({

    typeDefs,
  
    resolvers,

   context: ({req})=>{
      const authHeader = req.headers.authorization || '';
    
      if (typeof  authHeader  ===  'undefined') {
        let user = "A token is required for authentication"
        
        return {user}
        
      }
    // Get the token from the authorization header
      const token = authHeader.split(' ')[1] || '';
      try {
        // Verify the token with the secret key
        const user = jwt.verify(token, process.env.JWT_TOKEN);
        
        // Add the authenticated user to the context
        return { user };
      } catch (error) {
        return 'Invalid token'
      }
   }
})

const app = express()



app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.json())


app.options('*', cors()); // preflight OPTIONS; put before other routes
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT,PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});








app.get('/',(req,res)=>{
    res.status(200).send({message:"Home Route",status:true})
})


module.exports = {server, app}
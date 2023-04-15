const express = require("express")
const cors = require("cors")

const jwt = require("jsonwebtoken")

const bodyParser = require("body-parser")

const { ApolloServer } = require('apollo-server-express')

require("dotenv").config()


const resolvers = require("./Schemas/resolvers")
const typeDefs = require("./Schemas/typeDefs")


  

const server = new ApolloServer({

    typeDefs,
  
    resolvers,
    introspection: true, // enable introspection
    playground: true, // enable GraphQL Playground

   context: ({req})=>{
         
      const authHeader = req?.headers?.authorization || '';
     console.log(authHeader, "headerrr")
      if (typeof  authHeader  ===  'undefined') {
        let user = "A token is required for authentication"
        
        return {user}
        
      }
    // Get the token from the authorization header
      const token = authHeader.split(' ')[1] || '';
      //console.log("token",token)
      try {
        // Verify the token with the secret key
        const user = jwt.verify(token, process.env.JWT_TOKEN);
        
        // Add the authenticated user to the context
        //console.log(user)
        return { user };
      } catch (error) {
        console.log(error,"error")
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
    res.setHeader('Access-Control-Allow-Origin', 'https://studio.apollographql.com');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res
    next();
});








app.get('/',(req,res)=>{
    res.status(200).send({message:"Home Route",status:true})
})


module.exports = {server, app}
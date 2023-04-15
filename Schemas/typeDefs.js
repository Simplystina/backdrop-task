const graphl = require("graphql")
const {gql} = require("apollo-server-express")


const Bank = {
    id: String,
    account_name : String,
    account_number : String,
    bank_code:  String,
    user_id:  String
}
const typeDefs = gql`
  type Bank {
    id: String,
    account_name : String,
    account_number : String , 
    bank_code:  String,
    user_id:  String
  }

  type User {
    _id: String,
    username : String,
    email : String , 
    password:  String,
    is_verified:String,
    token: String
  }

  type Query {
    getAccountName(user_account_name: String, user_account_number: String!, user_bank_code: String!): [Bank]
  }

  type Mutation {
    signup(username: String!, password: String!, email: String!): User,
    login(password: String!, email: String!): User
    addUserBankDetails(user_account_name: String!, user_account_number: String!, user_bank_code: String!): [Bank]
   }
`


module.exports = typeDefs
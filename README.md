# Backdrop Bank Account Verification
The Backdrop Bank Account Verification is a GraphQL API that allows users to add their bank accounts by providing their bank account number, selecting a bank name, and writing their name as registered with their banks. The API provides a mutation to validate the provided bank account details and return the verified user details, and a query to get the account name associated with a bank account number and bank code.

## Backend Architecture
Our backend is built on top of the following technologies:

* Node.js - A JavaScript runtime for building server-side applications
* Express - A popular web framework for Node.js
* GraphQL - A query language for APIs that allows clients to request only the data they need
* Apollo Server - An open-source GraphQL server that simplifies building GraphQL APIs
* MongoDB - A NoSQL document database that stores data in flexible, JSON-like documents

## Authentication
Both endpoints require authentication with a JSON Web Token (JWT) issued upon successful login. To obtain a JWT, the client should first call the signup mutation with a name, email, and password. Then, the client can call the login mutation with the same email and password to obtain a JWT that can be included in the Authorization header of subsequent requests using the Bearer token scheme.

## Setup
* Install NodeJS
* pull the backend branch at backend branch
* Open the folder on your local computer
* At the terminal, run npm install to install all packages
* create a .env file and replace the variables in the .env.example file with the correct variables
* run npm run start:dev or nodemon to start the server
* This will start the Apollo Server instance on http://localhost:4000/graphql. You can use a tool like GraphQL Playground to explore the API and run queries and mutations.

## LIVE URL
The api url was deployed using render and the live link is [https://bank-verify.onrender.com/graphql](https://bank-verify.onrender.com/graphql) Use the apollo playground at https://studio.apollographql.com/sandbox/explorer to run queries and test the API 



## GraphQL Mutation

There are 3 differents mutations provided by the API

## Signup mutation
The GraphQL mutation provided by the API accepts the following arguments:
* username: String!
* password: String!
* email: String!
The mutation returns the following fields: (The Signup and login endpoint are the fields used to create the already existing user object)

# Example Request
```mutation {
  signup(name: "John Doe", email: "johndoe@example.com", password: "password") {
    token
    user {
      id
      name
      email
    }
  }
}
```
# Result Response
```{
  "data": {
    "signup": {
      "username": "chidinma",
      "email": "chidinma@gmail.com",
      "is_verified": "false",
      "_id": "643a1814826ecc0445da2cfd"
    }
  }
}
```

## Login Mutation
The login mutation allows users to obtain a JWT for subsequent authenticated requests to the API. The mutation takes two arguments:

* email: The email address of the user (required)
* password: The password for the user account (required)
Example Request:


```mutation Login($password: String!, $email: String!) {
  login(password: $password, email: $email) {
    token
    is_verified
    email
    username
  }
}
```

Example Response

```{
  "data": {
    "login": {
      "token": "<JWT token>",
      "is_verified": "false",
      "email": "chidinma@gmail.com",
      "username": "chidinma"
    }
  }
}
```

## Add Bank Account Mutation
The AddUSerBankDetails mutation allows users to add a bank account to their account on Backdrop. The mutation takes three arguments:

* user_account_number: The account number of the bank account (required)
* user_bank_code: The bank code of the bank where the account is held (required)
* user_account_name: The name associated with the bank account (required)

Example Request:
```mutation AddUserBankDetails($userAccountName: String!, $userAccountNumber: String!, $userBankCode: String!) {
  addUserBankDetails(user_account_name: $userAccountName, user_account_number: $userAccountNumber, user_bank_code: $userBankCode) {
    account_name
    account_number
    user_id
  }
}
```
Example Response
```{
  "data": {
    "addUserBankDetails": [
      {
        "account_name": "Nwatu Chidinma Augustina",
        "account_number": "235447806",
        "user_id": "6439540b1b8f951394f35804"
      }
    ]
  }
}
```

 
 
# GraphQL Query

# GetAccountName

The GraphQL query provided by the API accepts the following arguments:
bank_code: String!
account_number: String!
account_name: String(optional)
The query returns the following field:

account_name: String!
Example Request

```query GetAccountName($userAccountName: String!, $userAccountNumber: String!, $userBankCode: String!) {
  getAccountName(user_account_name: $userAccountName, user_account_number: $userAccountNumber, user_bank_code: $userBankCode) {
    account_name
  }
}
```

Example Response

```{
  "data": {
    "getAccountName": [
      {
        "account_name": "Nwatu Chidinma Augustina"
      }
    ]
  }
}
```
The API first checks if the account name provided by the user is available and returns it if found. Otherwise, it makes a call to the Paystack API to retrieve the account name and returns it in sentence case.

# In 100 words or less, provide an answer to this What's a good reason why  the pure Levenshtein Distance algorithm might be a more effective solution than the broader Damerau–Levenshtein Distance algorithm in this specific scenario written above?

The pure Levenshtein Distance algorithm might be a more effective solution than the Damerau-Levenshtein Distance algorithm in this specific scenario because it is a simpler and faster algorithm that only calculates the number of insertions, deletions, and substitutions required to transform one string into another. In contrast, the Damerau-Levenshtein Distance algorithm also includes transpositions, which means that it allows for additional operations of swapping adjacent characters. In the context of verifying bank account names, transpositions are unlikely to occur frequently and are therefore unnecessary, making the pure Levenshtein Distance algorithm a more efficient and appropriate solution.


## Assumptions
* The Paystack API returns the account name in sentence case.
* The provided user account name and Paystack account name are compared ignoring case.
* The Levenshtein Distance algorithm is used to compute the distance between the user account name and the Paystack account name.
* The maximum Levenshtein Distance allowed is 2 for a user to be verified.

## Testing
* The Backdrop Bank Account Verification API should be tested to ensure it works as expected. Sample test cases can include:

* Test that a user is marked as verified if the provided account name matches the Paystack account name or has a Levenshtein Distance of 2.
* Test that a user is not marked as verified if the provided account name does not match the Paystack account name or has a Levenshtein Distance greater than 2.
* Test that the API returns the user-provided account name in sentence case if available.
* Test that the API returns the Paystack account name in sentence case if the user-provided account name is not available.

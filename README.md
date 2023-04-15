# Backdrop Bank Account Verification
The Backdrop Bank Account Verification is a GraphQL API that allows users to add their bank accounts by providing their bank account number, selecting a bank name, and writing their name as registered with their banks. The API provides a mutation to validate the provided bank account details and return the verified user details, and a query to get the account name associated with a bank account number and bank code.


## Authentication
Both endpoints require authentication with a JSON Web Token (JWT) issued upon successful login. To obtain a JWT, the client should first call the signup mutation with a name, email, and password. Then, the client can call the login mutation with the same email and password to obtain a JWT that can be included in the Authorization header of subsequent requests using the Bearer token scheme.


## Signup Mutation
The signup mutation allows users to create a new account with Backdrop. The mutation takes three arguments:

username: The name of the user (required)
email: The email address of the user (required)
password: The password for the user account (required)

## GraphQL Mutation

There are 3 differents mutations provided by the API

## Signup mutation
The GraphQL mutation provided by the API accepts the following arguments:
username: String!
password: String!
email: String!
The mutation returns the following fields: (The Signup and login endpoint are the fields used to create the already existing user object)

# Example Request
`mutation {
  signup(name: "John Doe", email: "johndoe@example.com", password: "password") {
    token
    user {
      id
      name
      email
    }
  }
}
`
# Result Response
`{
  "data": {
    "signup": {
      "username": "chidinma",
      "email": "chidinma@gmail.com",
      "is_verified": "false",
      "_id": "643a1814826ecc0445da2cfd"
    }
  }
}
`

## Login Mutation
The login mutation allows users to obtain a JWT for subsequent authenticated requests to the API. The mutation takes two arguments:

email: The email address of the user (required)
password: The password for the user account (required)
Example Request:


`mutation Login($password: String!, $email: String!) {
  login(password: $password, email: $email) {
    token
    is_verified
    email
    username
  }
}
`

Example Response

`{
  "data": {
    "login": {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyaWQiOiI2NDNhMTgxNDgyNmVjYzA0NDVkYTJjZmQiLCJlbWFpbCI6ImNoaWRpbm1hQGdtYWlsLmNvbSIsImlhdCI6MTY4MTUyODk4MCwiZXhwIjoxNjgxNTQ2OTgwfQ.YD2z0YnukVkeMA7n5ktRv_flHtnRTzKh5J7IbaVqLgI",
      "is_verified": "false",
      "email": "chidinma@gmail.com",
      "username": "chidinma"
    }
  }
}`

## Add Bank Account Mutation
The AddUSerBankDetails mutation allows users to add a bank account to their account on Backdrop. The mutation takes three arguments:

user_account_number: The account number of the bank account (required)
user_bank_code: The bank code of the bank where the account is held (required)
user_account_name: The name associated with the bank account (required)
Example Request:
`mutation AddUserBankDetails($userAccountName: String!, $userAccountNumber: String!, $userBankCode: String!) {
  addUserBankDetails(user_account_name: $userAccountName, user_account_number: $userAccountNumber, user_bank_code: $userBankCode) {
    account_name
    account_number
    user_id
  }
}
`
Example Response
`{
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
`

 
 
# GraphQL Query
The GraphQL query provided by the API accepts the following arguments:

bank_code: String!
account_number: String!
The query returns the following field:

account_name: String!
The API first checks if the account name provided by the user is available and returns it if found. Otherwise, it makes a call to the Paystack API to retrieve the account name and returns it in sentence case.

Assumptions
The Paystack API returns the account name in sentence case.
The provided user account name and Paystack account name are compared ignoring case.
The Levenshtein Distance algorithm is used to compute the distance between the user account name and the Paystack account name.
The maximum Levenshtein Distance allowed is 2 for a user to be verified.
Testing
The Backdrop Bank Account Verification API should be tested to ensure it works as expected. Sample test cases can include:

Test that a user is marked as verified if the provided account name matches the Paystack account name or has a Levenshtein Distance of 2.
Test that a user is not marked as verified if the provided account name does not match the Paystack account name or has a Levenshtein Distance greater than 2.
Test that the API returns the user-provided account name in sentence case if available.
Test that the API returns the Paystack account name in sentence case if the user-provided account name is not available.

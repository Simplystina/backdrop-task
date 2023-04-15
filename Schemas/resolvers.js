
const { verifyUser, verifyAccountname} = require("../controller/bank")
const {login, register} = require("../controller/auth")



const resolver = {
    Query: {
        getAccountName(parent, args, context){
            console.log(context,"context")
            if(!context.user){
                throw new Error("Valid Authentication needed")
            }
            return verifyAccountname(args, context)
        }
        
    },
    Mutation: {
        addUserBankDetails(parents, args, context){
            console.log(context.user,"context")
            if(!context.user){
                throw new Error("Valid Authentication needed")
            }
            console.log(context,"context")
              return verifyUser(
                    args,
                    context
                )
            
        },
        signup(parents, args, context){
            return register(args)
        },
        login(parents, args, context){
            return login(args)
        }
    }
}

module.exports = resolver


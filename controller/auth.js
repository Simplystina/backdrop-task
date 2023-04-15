const UserModel = require("../Model/user")
const jwt = require("jsonwebtoken")



const register = async(args)=>{
    let err = ''
    try {
       
        const {name, email, password}=data = args
        
        const oldUser = await UserModel.findOne({email})
        console.log(oldUser,"olduser")
        if (oldUser) {
            err = `User Already exist. Please Login`
            throw new Error(err)
            
        }

        //create user in our database

        const user = await UserModel.create(args)

        console.log(user,"user")
        //return new user
        return user
    
    } catch (error) {
         console.log(error,"error")
         throw new Error(err)
    }
}

const login = async(args)=>{
    
    let err =''
    try {
          
        //Get user input
        const {email, password} = args
        //Validate user input

       
        //Validate if user exist in our database
        const user = await UserModel.findOne({email})
        
        if(!user){
            err = `User doesn't exist`
            throw new Error(err)
            
        
        }
        
        //validate user password
        const validate = await user.isValidPassword(password)

        if(!validate){
            err = `Wrong password entered`
            throw new Error(err)
        }
          
        
        

        //create token
        const token = jwt.sign(
            { userid: user._id, email},
            process.env.JWT_TOKEN,
            {
                expiresIn: "5h"
            }
        )
        console.log(token,"tokennnnn")
        //save user token
        userData = user.toObject();
        userData.token = token 
       
        //Delete the password from the object so as not to display the hash to the user
       
        const data = await UserModel.findOneAndUpdate(
            { email: email},
            {
               $set: userData
            }, {returnNewDocument : true }
            )
          console.log(data, "dataaaaaaaaaaa")
        
       return  data
    } catch (error) {
        console.log(error, "error")
        throw new Error(err)
        
    }

}

module.exports ={login, register}
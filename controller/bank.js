const axios = require("axios")
const BankModel = require("../Model/bankDetails")
const UserModel = require("../Model/user")

const levenshteinDistance = (s, t) =>{
    // Initialize a matrix of size (s.length + 1) by (t.length + 1)
    let d = new Array(s.length + 1);
    for (let i = 0; i <= s.length; i++) {
      d[i] = new Array(t.length + 1);
    }
  
    // Populate the first row and column of the matrix
    for (let i = 0; i <= s.length; i++) {
      d[i][0] = i;
    }
    for (let j = 0; j <= t.length; j++) {
      d[0][j] = j;
    }
  
    // Compute the minimum edit distance using dynamic programming
    for (let j = 1; j <= t.length; j++) {
      for (let i = 1; i <= s.length; i++) {
        if (s.charAt(i - 1) === t.charAt(j - 1)) {
          cost = 0;
        } else {
          cost = 1;
        }
        d[i][j] = Math.min(
          d[i - 1][j] + 1, // deletion
          d[i][j - 1] + 1, // insertion
          d[i - 1][j - 1] + cost // substitution
        );
      }
    }
  
    // Return the final edit distance
    return d[s.length][t.length];
  }
  



const verifyUser = async(args, context)=>{
  
  let err = ''
  const {user_account_number, user_bank_code, user_account_name} = args

  const headers = {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      'Content-Type': 'application/json'
    };
  try {
    const response = await axios.get(`https://api.paystack.co/bank/resolve?account_number=${user_account_number}&bank_code=${user_bank_code}`, { headers })
       console.log(response.data, "responseeeeeeeeeeee")
       const resp = response.data
       const distance = levenshteinDistance(user_account_name.toLowerCase(), resp.data.account_name.toLowerCase())
       console.log(distance)
       if(distance <= 2){
        
        const bankData = await BankModel.find({account_number:user_account_number})
          //console.log(bankData,"BANKdataaaaaaaaaa")
          if(bankData.length>0){
             return bankData
          }
         const data = await BankModel.create({
          bank_code : user_bank_code,
          account_number : user_account_number,
           account_name : user_account_name,
           user_id: context.user.userid
        })
        const updateUser = await UserModel.findOneAndUpdate(
          {_id: context.user.userid},
          { $set :{
            is_verified: true}
          },{returnNewDocument : true }
         )
         console.log(updateUser,"updateduser")
       console.log(data, "dataaaa")
       return data
       
       }else{
        
        err = "Account found but levenshtein Distance is greater than 2"
        throw new Error(err);
       }
       
  } catch (error) {
    
      
      console.log(error, "error")
      throw new Error(`${err || error.response.data.message}'}`);
        
  }
}

const verifyAccountname = async(args,context)=>{
  console.log(context, "argtttttttttttt")
  let {user_account_number, user_bank_code, user_account_name} = args
  let err = ''

  const headers = {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      'Content-Type': 'application/json'
    };
    //user_account_number = parseInt(user_account_number)
  try {
      const response = await axios.get(`https://api.paystack.co/bank/resolve?account_number=${user_account_number}&bank_code=${user_bank_code}`, { headers })
      // console.log(response.data, "responseeeeeeeeeeee")
       const resp = response.data
       const distance = levenshteinDistance(user_account_name.toLowerCase(), resp.data.account_name.toLowerCase())
      
       //console.log(distance,"distance")

       if(distance <= 2){

          // Set the options for the upsert operation

          

          const data = await BankModel.findOneAndUpdate(
            { account_number: user_account_number },
            {
               $set: {
                account_name: user_account_name || resp.data.account_name,
                bank_code : user_bank_code,
                user_id : context.user.userid
              }
            }, {returnNewDocument : true }
            )
          //console.log(data, "dataaaaaaaaaaa")
            if(data === null){
             // console.log(args)
              const newdata = await BankModel.create({
                bank_code: user_bank_code,
                account_number :user_account_number,
                 account_name: user_account_name,
                 user_id : context.user.userid
              })
    
              console.log(newdata,"created data")
              return [newdata]
            }
           // console.log(data,"updated data")
          console.log(context.user.userid,"idddddddddddd")
         const updateUser = await UserModel.findOneAndUpdate(
          {_id: context.user.userid},
          { $set :{
            is_verified: true}
          },{returnNewDocument : true }
         )
         console.log(updateUser,"updateduser")
          return [data]
       }else{
          
        err = "Account found but levenshtein Distance is greater than 2"
        //console.log(err)
        throw new Error(err);
       }

       
  } catch (error) {
    //console.log(error.response.data, "error")
    throw new Error(`${err || error.response.data.message}'}`);
    
  }
}

module.exports = {verifyUser, verifyAccountname}
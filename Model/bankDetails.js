const mongoose = require("mongoose")

const Schema = mongoose.Schema
const ObjectId = Schema.ObjectId

const BankModel = new mongoose.Schema({

    id: ObjectId,
    account_name :{type: String},
    account_number :{type: Number, unique: true, required:true},
    bank_code: {type: String, required:true},
    user_id: {type:String}
  },
  {
    timestamps: true, toJSON: {virtuals: true}
}
)



const Bank = mongoose.model('bank', BankModel)

module.exports = Bank
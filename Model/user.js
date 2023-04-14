const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")

const Schema = mongoose.Schema
const ObjectId = Schema.ObjectId

const UserModel = new mongoose.Schema({

    id: ObjectId,
    username :{type: String},
    email: {type: String, required:true, unique: true},
    password: {type: String, required:true},
    is_verified:{type:Boolean, default:false, enum:[true,false]},
    token:{type:String}
  },
  {
    timestamps: true, toJSON: {virtuals: true}
}
)


UserModel.pre(
    'save',
    async function(next){
        const user = this;
        const hash = await bcrypt.hash(this.password, 10)

        this.password = hash
        next()
    }
)

UserModel.methods.isValidPassword = async function(password){
    const user = this
    const compare = await bcrypt.compare(password, user.password)
    
    return compare
}

const User = mongoose.model('users', UserModel)

module.exports = User
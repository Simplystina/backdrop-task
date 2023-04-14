const jwt = require("jsonwebtoken")

const verifyToken = (req, next)=>{
    const bearerHeader = req.headers["authorization"]
   
    let err = ''
    if (typeof bearerHeader ===  'undefined') {
        
        return "A token is required for authentication"
        
    }
    try {
        const bearer = bearerHeader.split(' ')
        const token = bearer[1]
        
        const decoded = jwt.verify(token, process.env.JWT_TOKEN)
        req.user = decoded
       
       req.user
    } catch (error) {
       
        return 'Invalid Token'
    }
    return next()
}

module.exports = verifyToken
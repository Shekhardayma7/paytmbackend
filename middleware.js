const JWT_SECRET = require("./config");
const jwt = require("jsonwebtoken");

const authMiddleware = (req,res,next) =>{
    const authHeader = req.headers.authorization;

    if(!authHeader || !authHeader.startsWith('Bearer')){
        return res.status(403).json({msg:"token is not started with the bearer "});
    }

    const token = authHeader.split(' ')[1];
    console.log(token)
    try {
        const decoded = jwt.verify(token,JWT_SECRET);
        req.decoded=decoded
        next();
    }catch (err){
        console.log(JWT_SECRET)
        console.log(req.decoded)
        return res.status(403).json({msg:"token is wrong",token:token})
    }
};

module.exports = {authMiddleware}

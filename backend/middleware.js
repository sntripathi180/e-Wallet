const {JWT_SECRET} = require("./config");
const jwt = require("jsonwebtoken");

const authMiddleware = (req,res,next)=>{
    const authHeader = req.headers.authorization;
    console.log("Auth Header:", authHeader);
    if(!authHeader || !authHeader.startsWith('Bearer ')){
        console.log("❌ No Authorization header or invalid format.");
        return res.status(403).json({
            message:"Unauthorized"
        });
    }

    const token = authHeader.split(' ')[1];
    console.log("Extracted Token:", token); 
    try{
         const decoded = jwt.verify(token,JWT_SECRET);
        console.log("✅ Token Decoded Successfully:", decoded);
        if(decoded.userId){
            req.userId = decoded.userId;
            console.log("✅ User Authenticated, ID:", req.userId);
            next();
        }else{
            return res.status(403).json({ message: "Invalid Token 1" });  
        }
    

    }catch(err){
        console.log("❌ JWT Verification Failed:", err.name, "-", err.message);
        return res.status(403).json({ message: `Invalid Token - ${err.message}` });
    }
};


module.exports ={
    authMiddleware
}
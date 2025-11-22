import jwt from "jsonwebtoken"
const isAuth = async (req,res,next) => {
    try {
      const token= req.cookies?.token
      if(!token){
        return res.status(401).json({message:"token not found"})
      }
      const decodToken = jwt.verify(token,process.env.JWT_SECRET)
      if(!decodToken){
        return res.status(401).json({message:"token not verified"})
      }
      req.userId= decodToken.userId
      next()
    } catch (error) {
      return res.status(401).json({message:"isAuth error"})
    }
}

export default isAuth

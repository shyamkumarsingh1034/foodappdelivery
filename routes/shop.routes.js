import express from "express"
import isAuth from "../middleware/isAuth.js"
import { createAndEditShop, getMyShop } from "../controllers/shop.controllers.js"
import { upload } from "../middleware/multer.js"

const shopRouter = express.Router()
shopRouter.post("/createshop",isAuth,upload.single("image"),createAndEditShop)
shopRouter.get("/getmyshop",isAuth,getMyShop )

export default shopRouter

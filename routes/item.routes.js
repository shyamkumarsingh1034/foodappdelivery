import express from "express"
import isAuth from "../middleware/isAuth.js"
import { addItem, editItem } from "../controllers/item.controllers.js"
import { upload } from "../middleware/multer.js"

const itemRouter = express.Router()
itemRouter.post("/additem",isAuth,upload.single("image"),addItem)
itemRouter.post("/edititem/:itemId",isAuth,upload.single("image"),editItem)

export default itemRouter

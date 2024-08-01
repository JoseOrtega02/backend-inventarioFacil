import express from "express"
import * as salesController from "../Sales/controller/salesController.js"
import { authUser } from "../middleware/authUser.js"
const Router = express.Router()
Router.use("/",authUser)
Router.post("/",salesController.postSale)
Router.get("/",salesController.getSale)
Router.delete("/",salesController.deleteSale)
export default Router
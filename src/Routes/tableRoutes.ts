import express from "express"
import * as tableController from "../Tables/controller/tableController.js"
import * as itemController from "../Tables/controller/itemController.js"
import { authUser } from "../middleware/authUser.js"
const router = express.Router()
router.use("/", authUser)
router.get("/", tableController.getTables)
router.post("/create", tableController.createTable)
router.delete("/delete/:tableId", tableController.deleteTable)
router.put("/update", tableController.updateTable)
router.post("/item", itemController.addItem)
router.delete("/item", itemController.removeItem)
router.put("/item", itemController.updateItem)
router.get("/item/:id", itemController.getItems)
export default router

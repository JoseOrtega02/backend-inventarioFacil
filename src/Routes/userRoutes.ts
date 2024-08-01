import express from "express";
import * as userController from "../Users/controller/userController.js"
const router=  express.Router()
router.get("/",userController.getAuthenticatedUser)
router.post("/login",userController.login)
router.post("/register",userController.signUp)
router.post("/logout",userController.logout)
export default router
import express from "express"
import { createOrder, verifyPayment } from "../controller/paymentController.js"
import isAuth from "../middleware/isAuth.js"

 const paymentRouter = express.Router()

  paymentRouter.post("/create-order/:courseId", isAuth, createOrder)
    paymentRouter.post("/verify", isAuth, verifyPayment)

export default paymentRouter
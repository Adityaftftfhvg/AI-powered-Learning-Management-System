import express from "express"
import isAuth from "../middleware/isAuth.js"
import { getMyCertificates, verifyCertificate } from "../controller/certificateController.js"

const certificateRouter = express.Router()

certificateRouter.get("/my", isAuth, getMyCertificates)
certificateRouter.get("/verify/:certificateId", verifyCertificate)

export default certificateRouter
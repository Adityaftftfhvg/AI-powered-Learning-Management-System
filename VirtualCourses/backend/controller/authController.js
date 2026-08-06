import User from "../model/userModel.js"
import validator from 'validator'
import bcrypt from 'bcryptjs'
import genToken from '../config/token.js'
import nodemailer from 'nodemailer'
export const signup = async(req,res)=>{
    try {
        const {name,email,password,role} = req.body 
        let existUser = await User.findOne({email});
        if(existUser){
       return res.status(400).json({message:"user already exist"})
        }
        if(!validator.isEmail(email)){
            return res.status(400).json({message:"Enter valid Email"});
        }
        if(password.length<8){
            return res.status(400).json({message:"Enter strong password"})
        }
        let hashPassword = await bcrypt.hash(password,10);
        const user = await User.create({
            name,
            email,
            password:hashPassword,
            role
        })
        let token = await genToken(user._id)
        res.cookie("token",token,{
            httpOnly: true,
          secure: true,
sameSite: "lax",
            maxAge : 7*24*60*60*1000

        })
        res.status(201).json(user)
    } catch (error) {
        return res.status(500).json({message:`SignUp error ${error}`})
    }
}   

export const login = async (req,res) => {
    try {
        const {email,password} = req.body
        let user = await User.findOne({email})
        if(!user){
            return res.status(404).json({message:"USER not found"})
        }
        let isMatch = await bcrypt.compare(password,user.password)
        if(!isMatch){
             return res.status(404).json({message:"incorrect password"})
        }
         let token = await genToken(user._id)
        res.cookie("token",token,{
            httpOnly: true,
            secure:false,
            sameSite: "strict",
            maxAge : 7*24*60*60*1000

        })
        return res.status(200).json(user)
    } catch (error) {
return res.status(404).json({message:"login error"})

    }
}
    
    export const logOut = async (req,res) => {
        try {
            await res.clearCookie("token")
            return res.status(200).json({message:"Logged out successfully!"})
        } catch (error) {
            return res.status(404).json({message:"logout error"})
        }
    }
    export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body
        const user = await User.findOne({ email })
        if (!user) return res.status(404).json({ message: "User not found" })

      
        const otp = Math.floor(100000 + Math.random() * 900000).toString()
        const expiry = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

        user.resetOtp = otp
        user.resetOtpExpiry = expiry
        await user.save()

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        })

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Your Password Reset OTP",
            html: `<p>Your OTP is: <strong>${otp}</strong>. It expires in 10 minutes.</p>`
        })

        return res.status(200).json({ message: "OTP sent to your email" })
    } catch (error) {
        return res.status(500).json({ message: `Error: ${error}` })
    }
}


export const resetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body
        const user = await User.findOne({ email })
        if (!user) return res.status(404).json({ message: "User not found" })

        if (user.resetOtp !== otp)
            return res.status(400).json({ message: "Invalid OTP" })

        if (new Date() > user.resetOtpExpiry)
            return res.status(400).json({ message: "OTP has expired" })

        if (newPassword.length < 8)
            return res.status(400).json({ message: "Password must be at least 8 characters" })

        user.password = await bcrypt.hash(newPassword, 10)
        user.resetOtp = null
        user.resetOtpExpiry = null
        await user.save()

        return res.status(200).json({ message: "Password reset successfully" })
    } catch (error) {
        return res.status(500).json({ message: `Error: ${error}` })
    }
}
import Razorpay from "razorpay"
import crypto from "crypto"
import Course from "../model/courseModel.js"
import Order from "../model/orderModel.js"

const getRazorpayInstance = () => new Razorpay({
 key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
})


export const createOrder = async (req, res) => {
    try {
    const userId = req.userId
   const { courseId } = req.params

      const course = await Course.findById(courseId)
    if (!course) {
            return res.status(404).json({ message: "Course not found" })
        }

        if (course.enrolledStudent.includes(userId)) {
            return res.status(400).json({ message: "Already enrolled in this course" })
        }

        const amount = Math.round((course.price || 0) * 100) // paise

        
        if (amount <= 0) {
           course.enrolledStudent.push(userId)
         await course.save()
          return res.status(200).json({ free: true, message: "Enrolled in free course" })
        }

        const razorpay = getRazorpayInstance()
        const razorpayOrder = await razorpay.orders.create({
         amount,
          currency: "INR",
      receipt: `receipt_${courseId}_${Date.now()}`
        })

        const order = await Order.create({
     user: userId,
         course: courseId,
      amount,
            razorpayOrderId: razorpayOrder.id
        })

        return res.status(200).json({
           free: false,
          orderId: razorpayOrder.id,
        amount,
          currency: razorpayOrder.currency,
         key: process.env.RAZORPAY_KEY_ID,
            courseTitle: course.title,
            dbOrderId: order._id
        })
    } catch (error) {
        return res.status(500).json({ message: `createOrder error ${error}` })
    }
}


export const verifyPayment = async (req, res) => {
    try {
     const userId = req.userId
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
          return res.status(400).json({ message: "Missing payment verification fields" })
        }

        const order = await Order.findOne({ razorpayOrderId: razorpay_order_id, user: userId })
        if (!order) {
          return res.status(404).json({ message: "Order not found" })
        }

        const body = `${razorpay_order_id}|${razorpay_payment_id}`
        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
          .update(body)
            .digest("hex")

        if (expectedSignature !== razorpay_signature) {
         order.status = "failed"
      await order.save()
            return res.status(400).json({ message: "Payment verification failed" })
        }

          order.status = "paid"
      order.razorpayPaymentId = razorpay_payment_id
    order.razorpaySignature = razorpay_signature
        await order.save()

        const course = await Course.findById(order.course)
        if (course && !course.enrolledStudent.includes(userId)) {
       course.enrolledStudent.push(userId)
            await course.save()
        }

     return res.status(200).json({ message: "Payment verified, enrollment successful", course })
    } catch (error) {
        return res.status(500).json({ message: `verifyPayment error ${error}` })
    }
}
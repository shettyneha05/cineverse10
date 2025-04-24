const express = require("express")
const jwt = require("jsonwebtoken")
const User = require("../models/User")
const auth = require("../middleware/auth")
const nodemailer = require("nodemailer")

const router = express.Router()

const transporter = nodemailer.createTransport({
  service: "gmail", // You can use other services or SMTP settings
  auth: {
    user: "instabiller@gmail.com",
    pass: "qyjyukvtsshdsbgm",
  },
})


const sendOTP = async (to, otp) => {
  const mailOptions = {
    from: `Cineverse OTP <${"instabiller@gmail.com"}>`,
    to,
    subject: "Cineverse Account Verification - Your OTP",
    text: `Hello,

Thank you for registering with Cineverse! 

Your One-Time Password (OTP) for account verification is: ${otp}

Please note that this OTP will expire in 5 minutes. If you did not request this, please ignore this email.

Best regards,
The Cineverse Team`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2 style="color: #4CAF50;">Cineverse Account Verification</h2>
        <p>Thank you for registering with Cineverse!</p>
        <p>Your One-Time Password (OTP) for account verification is:</p>
        <p style="font-size: 1.5em; font-weight: bold; color: #4CAF50;">${otp}</p>
        <p style="color: #555;">This OTP will expire in <strong>5 minutes</strong>. If you did not request this, please ignore this email.</p>
        <br>
        <p>Best regards,</p>
        <p><strong>The Cineverse Team</strong></p>
      </div>
    `,
  }
  console.log("Sending OTP to:", to)
  return transporter.sendMail(mailOptions)
}

router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: "User already exists with this email" })
    }

    const user = new User({
      name,
      email,
      password,
    })

    const otp = user.generateOTP()
    user.otp.code = otp
    user.otp.expiresAt = Date.now() + 5 * 60 * 1000
    await user.save()

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    })

    await sendOTP(email, otp);

    res.status(201).json({
      message: "User registered successfully. Please verify your account with the OTP.",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isVerified: user.isVerified,
      },
    })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" })
    }

    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" })
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    })

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isVerified: user.isVerified,
      },
    })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

router.post("/verify-otp", auth, async (req, res) => {
  try {
    const { otp } = req.body
    const user = await User.findById(req.user._id)

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "User is already verified" })
    }

    const isValid = user.verifyOTP(otp)
    if (!isValid) {
      return res.status(400).json({ message: "Invalid or expired OTP" })
    }

    user.isVerified = true
    user.otp = undefined 
    await user.save()

    res.json({
      message: "Account verified successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isVerified: user.isVerified,
      },
    })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

router.post("/resend-otp", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
    console.log(user)

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "User is already verified" })
    }

    const otp = user.generateOTP()
    console.log(otp)
    await sendOTP(user.email, otp)
    console.log("OTP sent to email")
    user.otp.code = otp
    user.otp.expiresAt = Date.now() + 5 * 60 * 1000
    await user.save()

    res.json({
      message: "OTP sent successfully",
      otp,
    })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

router.get("/profile", auth, async (req, res) => {
  try {
    res.json({
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        isVerified: req.user.isVerified,
      },
    })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

module.exports = router

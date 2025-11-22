import User from "../models/user.model.js"
import bcrypt from "bcryptjs"
import genToken from "../utils/token.js"
import { sendOtpMail } from "../utils/mail.js"

export const signUp = async (req, res) => {
  try {
    const { fullName, email, password, mobile, role } = req.body
    let user = await User.findOne({ email })
    if (user) {
      return res.status(400).json({ message: "User already exists." })
    }
    if (!password || password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters." })
    }
    if (!mobile || mobile.length < 10) {
      return res.status(400).json({ message: "Mobile number must be at least 10 digits." })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    user = await User.create({
      fullName,
      email,
      role,
      mobile,
      password: hashedPassword,
    })
    const token = await genToken(user._id)
   res.cookie("token", token, {
      httpOnly: true,
      sameSite: "none",
      secure: false,
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.status(201).json({ message: "User created", user })
  } catch (error) {
    return res.status(500).json({ message: `sign up ${error}` })
  }
}

export const signIn = async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ message: "User does not exist." })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect password." })
    }
    const token = await genToken(user._id)
   res.cookie("token", token, {
      httpOnly: true,
      sameSite: "none",
      secure: false,
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.status(200).json({ message: "Login successful", user });

  } catch (error) {
    return res.status(500).json({ message: `sign in error ${error}` })
  }
}

export const signOut = async (req, res) => {
  try {
    res.clearCookie("token")
    return res.status(200).json({ message: "Logged out successfully" })
  } catch (error) {
    return res.status(500).json({ message: `sign out error ${error}` })
  }
}

export const sentOtp = async (req, res) => {
  try {
    const { email } = req.body
    if (!email) return res.status(400).json({ message: "Email is required" })

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ message: "User does not exist" })
    }
    const otp = Math.floor(1000 + Math.random() * 9000).toString()
    user.resetOtp = otp
    user.otpExpires = Date.now() + 5 * 60 * 1000
    user.isOtpVerified = false
    await user.save()
    await sendOtpMail(email, otp)
    return res.status(200).json({ message: "OTP sent successfully" })
  } catch (error) {
    return res.status(500).json({ message: `send otp error ${error}` })
  }
}

export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body
    if (!email || !otp) return res.status(400).json({ message: "Email and OTP required" })

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ message: "Invalid OTP" })
    }

    // check OTP match and expiry
    if (user.resetOtp !== otp || !user.otpExpires || user.otpExpires < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" })
    }

    user.isOtpVerified = true
    user.resetOtp = undefined
    user.otpExpires = undefined
    await user.save()
    return res.status(200).json({ message: "OTP verified successfully" })
  } catch (error) {
    return res.status(500).json({ message: `verify otp error ${error}` })
  }
}

export const resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body
    if (!email || !newPassword) return res.status(400).json({ message: "Email and newPassword required" })

    const user = await User.findOne({ email })
    if (!user || !user.isOtpVerified) {
      return res.status(400).json({ message: "OTP verification required" })
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" })
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10)
    user.password = hashedPassword
    user.isOtpVerified = false
    await user.save()
    return res.status(200).json({ message: "Password reset successfully" })
  } catch (error) {
    return res.status(500).json({ message: `reset password error ${error}` })
  }
}

export const googleAuth = async (req, res) => {
  try {
    const {email,fullName,mobile,role}= req.body;
    let user = await User.findOne({email});
    if(!user){
       user = await User.create({
         fullName,
          email,
          mobile,
          role,
       })
    }
    const token = await genToken(user._id)
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "none",
      secure: false,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })
    return res.status(200).json({ user });
  } catch (error) {
    return res.status(500).json({ message: `google auth error ${error}` })
  }
}

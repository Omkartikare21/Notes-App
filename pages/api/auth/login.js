import User from "@/models/User";
import dbConnect from "@/utils/dbconnect";
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import {createAccessToken, createRefreshToken } from '@/middlewares/generateToken'

dbConnect();

const logger = (handler) => async (req, res) => {
  console.log(`Incoming request for AUTH signup: ${req.method} ${req.url}`);
  return handler(req, res);
};

const handler = async (req, res) => {
  const { method } = req;

  switch (method) {
    case "POST": //login route api/auth/login
      try {

        const { email, password } = req.body;

        if (password?.length < 6) {
          return res.status(400).json({ success: false, message: "Password must be at least 6 characters long" });
        }

        try {
          // check if user already exists
          const existingUser = await User.findOne({
            $or: [
              { email: email }, // Check for email.
              { name: email }, // If name then check for name.
              { phone_number: email } // If phone number then check for phone number.
            ]
          }).select("+password");

          if (!existingUser) {
            return res.status(404).json({ success: false, message: "Invalid email or password" });
          }

          if(!existingUser.isVerified) {
            return res.status(403).json({ success: false, message: "Please Verify Your Email" });
          }

          // Check for password.
          const isMatch = await bcrypt.compare(password, existingUser.password);
          if (!isMatch) {
            return res.status(404).json({ success: false, message: "Invalid password" });
          }

          let vt = crypto.randomBytes(3).toString('hex')
          const verificationToken = parseInt(vt.toString('hex'),16).toString().substr(0,6)

          // Access and Refresh Token's
          const access_token = createAccessToken({ userId: existingUser._id });
          const refresh_token = createRefreshToken({ userId: existingUser._id });
          const token = access_token

          return res.status(200).json({ msg: "Login Success",
              token,
              access_token,
              refresh_token,
              existingUser
              });
        } catch (err) {
          return res.status(500).json({ success: false, message: "Internal server error" });
        }

      } catch (err) {
        return res.status(400).json({ success: false });
      }
      break;
    default:
      return res.status(400).json({ success: false });
      break;
  }
};

// Wrap your handler with the middleware
export default logger(handler);
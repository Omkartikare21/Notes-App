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
    case "POST":
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
            return res.status(400).json({ success: false, message: "Invalid email or name" });
          }

          if(!existingUser.isVerified) {
            return res.status(400).json({ success: false, message: "User is not verified" });
          }

          // Check for password.
          const isMatch = await bcrypt.compare(password, existingUser.password);
          if (!isMatch) {
            return res.status(400).json({ success: false, message: "Invalid password" });
          }

          let vt = crypto.randomBytes(3).toString('hex')
          const verificationToken = parseInt(vt.toString('hex'),16).toString().substr(0,6)

          // Access and Refresh Token's
          const access_token = createAccessToken({ id: existingUser._id });
          const refresh_token = createRefreshToken({ id: existingUser._id });
          const token = access_token

          // const token = jwt.sign({ userId: "125487" }, process.env.JWT_SECRET);
          console.log("User logged in:", token);
          res.status(200).json({ msg: "Login Success",
              token,
              access_token,
              refresh_token,
              existingUser
              });
        } catch (err) {
          // console.error("Error creating user:", err);
          console.log("Error occurred during login:", err);

          return res.status(500).json({ success: false, message: "Internal server error" });
        }

      } catch (err) {
        console.log("Error occurred during login:",err);
        
        res.status(400).json({ success: false });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
};

// Wrap your handler with the middleware
export default logger(handler);
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { createAccessToken, createRefreshToken } from "@/middlewares/generateToken";
import User from "@/models/User";
import dbConnect from "@/utils/dbconnect";
import crypto from 'crypto';

dbConnect();

// Example middleware function
const logger = (handler) => async (req, res) => {
  console.log(`Incoming request for AUTH: ${req.method} ${req.url}`);
  return handler(req, res);
};

const handler = async (req, res) => {
  const { method } = req;
  const token = req.query.token;

switch (method) {
  case "POST":
    try {
      const user = await User.findOne({ verificationToken: token });

      if(!user){
        return res.status(400).json({ success: false, message: "Invalid or Expired token" });
      }

      user.isVerified = true;
      user.verificationToken = undefined;
      user.verificationTokenExpires = undefined;

      await user.save();

      const access_token = createAccessToken({ userId: user._id });
      const refresh_token = createRefreshToken({ userId: user._id });

      // const note = await Notes.create(req.body);
      return res.status(201).json({ msg: "User verified successfully",
        access_token,
        refresh_token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          isVerified: user.isVerified
        },
      });
    } catch (err) {
      return res.status(400).json({ success: false, msg: "Error verifying user" });
    }
    break;
  default:
    return res.status(400).json({ success: false, msg: "Invalid request" });
    break;
  }
};

// Wrap your handler with the middleware
export default logger(handler);

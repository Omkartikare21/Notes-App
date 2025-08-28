import User from "@/models/User";
import dbConnect from "@/utils/dbconnect";
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';

dbConnect();

const logger = (handler) => async (req, res) => {
  console.log(`Incoming request for AUTH signup: ${req.method} ${req.url}`);
  return handler(req, res);
};

const handler = async (req, res) => {
  const { method } = req;

  switch (method) {
    case "GET":
      try {
        // const notes = await Notes.find({});
        res.status(200).json({ success: true, data: [] });
      } catch (err) {
        res.status(400).json({ success: false });
      }
      break;
    case "POST":
      try {

        const { name, email, password, phone_number } = req.body;

        if (password.length < 6) {
          return res.status(400).json({ success: false, message: "Password must be at least 6 characters long" });
        }

        try {
          // check if user already exists
          const existingUser = await User.findOne({ email: email });
          if (existingUser) {
            return res.status(400).json({ success: false, message: "User already exists" });
          }

          // Create a new user
          const newUser = new User({
            name,
            email,
            password,
            phone_number
          });

          newUser.password = await bcrypt.hash(password, 10);

          let vt = crypto.randomBytes(3).toString('hex')
          const verificationToken = parseInt(vt.toString('hex'),16).toString().substr(0,6)

          newUser.verificationToken = verificationToken;
          await newUser.save();

          const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET);

          res.status(200).json({ success: true, user: newUser, token , verificationToken});
        } catch (err) {
          console.log("Error creating user:", err);
          return res.status(500).json({ success: false, message: "Internal server error" });
        }

      } catch (err) {
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
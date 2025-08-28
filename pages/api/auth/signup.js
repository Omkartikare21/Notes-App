import User from "@/models/User";
import dbConnect from "@/utils/dbconnect";
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import handlebars from 'handlebars';
import readHTML from "@/utils/readHTML";
import sendEmail from "@/utils/sendEmail";
import { log } from "console";

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
          return res.status(409).json({ success: false, message: "User already exists" });
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

      newUser.verificationToken = crypto
      .createHash('sha256')
      .update(verificationToken)
      .digest('hex'); // Hash to token so no one else can access.

      newUser.verificationTokenExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

      const htmlTemplate = await readHTML('./emails/verify-email.html');
      const emailTemplate = handlebars.compile(htmlTemplate);
      const replacements = { baseURL: process.env.FE_API_URL, verificationToken: newUser.verificationToken };
      const html = emailTemplate(replacements);

      await newUser.save();

      try {
        await sendEmail({
          to: newUser.email,
          subject: "Notes App - Account Verification",
          html: html
        });
      } catch (err) {
        newUser.verificationToken = undefined
        newUser.verificationTokenExpires = undefined
        await newUser.save();
        return res.status(500).json({ success: false, message: "Email could not be sent" });
      }
      
      const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {expiresIn: '1h'}); // token expire in 1hr

      res.status(200).json({ success: true, msg:'Please Check your email!' , user: newUser, token , verificationToken});
      } catch (err) {
        return res.status(500).json({ success: false, message: "Internal server error" });
      }
      } catch (err) {
        res.status(400).json({ success: false, msg:"Email could not be sent" });
      }
      break;
  default:
    res.status(400).json({ success: false });
  break;
}
};

// Wrap your handler with the middleware
export default logger(handler);
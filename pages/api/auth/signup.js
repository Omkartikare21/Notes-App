import User from "@/models/User";
import dbConnect from "@/utils/dbconnect";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import handlebars from "handlebars";
import readHTML from "@/utils/readHTML";
import sendEmail from "@/utils/sendEmail";
import upload from "@/middlewares/imageUpload.middleware";
import { createRouter } from "next-connect";
import bodyParser from "body-parser";
import { getPublicId } from "@/utils/deleteImage";

const router = createRouter();
dbConnect();

router.use(bodyParser.json());

router.use(upload.single("profilePic")); // middleware for single file upload

router.post(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  try {
    const publicId = getPublicId(req.file.path); // "-- rsorl4rtziefw46fllvh --"

    const { name, email, password, phone_number } = req.body;

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long",
      });
    }

    try {
      // check if user already exists
      const existingUser = await User.findOne({ email: email });

      if (!existingUser === null) {
        return res
          .status(409)
          .json({ success: false, message: "User already exists" });
      }

      // Create a new user
      const newUser = new User({
        name,
        email,
        password,
        phone_number,
        profilePicUrl: req.file.path,
        publicId: publicId[0],
      });

      newUser.password = await bcrypt.hash(password, 10);

      let vt = crypto.randomBytes(3).toString("hex");
      const verificationToken = parseInt(vt.toString("hex"), 16)
        .toString()
        .substr(0, 6);

      newUser.verificationToken = crypto
        .createHash("sha256")
        .update(verificationToken)
        .digest("hex"); // Hash to token so no one else can access.

      newUser.verificationTokenExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

      const htmlTemplate = await readHTML("./emails/verify-email.html");
      const emailTemplate = handlebars.compile(htmlTemplate);
      const replacements = {
        baseURL: process.env.FE_API_URL,
        verificationToken: newUser.verificationToken,
      };
      const html = emailTemplate(replacements);

      await newUser.save();

      try {
        await sendEmail({
          to: newUser.email,
          subject: "Notes App - Account Verification",
          html: html,
        });
      } catch (err) {
        newUser.verificationToken = undefined;
        newUser.verificationTokenExpires = undefined;
        await newUser.save();
        return res
          .status(500)
          .json({ success: false, message: "Email could not be sent" });
      }

      const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      }); // token expire in 1hr

      return res.status(200).json({
        success: true,
        msg: "Please Check your email!",
        user: newUser,
        token,
        verificationToken,
      });
    } catch (err) {
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  } catch (err) {
    console.log("EMAIL ERR", err);

    return res
      .status(400)
      .json({ success: false, msg: "Email could not be sent" });
  }
});

export const config = {
  api: {
    bodyParser: false, // Disallow Next.js body parsing (multer handles it)
  },
};

export default router.handler({
  onError: (err, req, res) => {
    console.error(err);
    return res.status(500).end("Something went wrong!");
  },
});

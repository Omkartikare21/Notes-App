// import User from "@/models/User";
// import dbConnect from "@/utils/dbconnect";
// import bcrypt from "bcryptjs";
// import crypto from "crypto";
// import {
//   createAccessToken,
//   createRefreshToken,
// } from "@/middlewares/generateToken";

// dbConnect();

// const logger = (handler) => async (req, res) => {
//   console.log(`Incoming request for AUTH signup: ${req.method} ${req.url}`);
//   return handler(req, res);
// };

// const handler = async (req, res) => {
//   const { method } = req;
// console.log("XXX", method);
//   switch (method) {
//     case "POST": //login route api/auth/login
//       try {
//         const { email, password } = req.body;

//         if (password?.length < 6) {
//           return res.status(400).json({
//             success: false,
//             message: "Password must be at least 6 characters long",
//           });
//         }

//         try {

//           const existingUser = await User.findOne({
//             $or: [
//               { email: email },
//               { name: email }, 
//               { phone_number: email },
//             ],
//           }).select("+password");

//           if (!existingUser) {
//             return res
//               .status(404)
//               .json({ success: false, message: "Invalid email or password" });
//           }

//           if (!existingUser.isVerified) {
//             return res
//               .status(403)
//               .json({ success: false, message: "Please Verify Your Email" });
//           }

//           if (!existingUser.password) {
//             // User registered via Google/GitHub.
//             return res
//               .status(400)
//               .json({ success: false, message: "Account exists via Google." });
//           }

//           // Check for password.
//           const isMatch = await bcrypt.compare(password, existingUser.password);
//           if (!isMatch) {
//             return res
//               .status(404)
//               .json({ success: false, message: "Invalid password" });
//           }

//           let vt = crypto.randomBytes(3).toString("hex");
//           const verificationToken = parseInt(vt.toString("hex"), 16)
//             .toString()
//             .substr(0, 6);

//           // Access and Refresh Token's
//           const access_token = createAccessToken({ userId: existingUser._id });
//           const refresh_token = createRefreshToken({
//             userId: existingUser._id,
//           });
//           const token = access_token;

//           return res.status(200).json({
//             msg: "Login Success",
//             token,
//             access_token,
//             refresh_token,
//             existingUser,
//           });
//         } catch (err) {
          
//           return res
//             .status(500)
//             .json({ success: false, message: "Internal server error" });
//         }
//       } catch (err) {
//         console.log("Catch at line 99", err);
        
//         return res.status(400).json({ success: false });
//       }
//       break;
//     default:
//       console.log("DEFAULT BEEEEEE");
      
//       return res.status(400).json({ success: false });
//       break;
//   }
// };

// // Wrap your handler with the middleware
// export default logger(handler);


import { createRouter, nc } from "next-connect";
import User from "@/models/User";
import dbConnect from "@/utils/dbconnect";
import authMiddleware from "@/middlewares/auth.middleware";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import {
  createAccessToken,
  createRefreshToken,
} from "@/middlewares/generateToken";
import bodyParser from "body-parser";

const router = createRouter();
dbConnect();

router.use(bodyParser.json());

router.post(async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Please provide an email and password" });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: "Password must be at least 6 characters long" });
    }

    const existingUser = await User.findOne({
      $or: [
        { email },
        { name: email },
        { phone_number: email },
      ],
    }).select("+password");

    if (!existingUser) {
      return res.status(404).json({ success: false, message: "Invalid email or password" });
    }

    if (!existingUser.isVerified) {
      return res.status(403).json({ success: false, message: "Please Verify Your Email" });
    }

    if (!existingUser.password) {
      // User registered via Google/GitHub.
      return res.status(400).json({ success: false, message: "Account exists via Google." });
    }

    const isMatch = await bcrypt.compare(password, existingUser.password);
    if (!isMatch) {
      return res.status(404).json({ success: false, message: "Invalid password" });
    }

    // Generate verification token
    let vt = crypto.randomBytes(3).toString("hex");
    const verificationToken = parseInt(vt.toString("hex"), 16).toString().substr(0, 6);

    // Generate access and refresh tokens
    const access_token = createAccessToken({ userId: existingUser._id });
    const refresh_token = createRefreshToken({ userId: existingUser._id });

    return res.status(200).json({
      msg: "Login Success",
      token: access_token,
      access_token,
      refresh_token,
      existingUser,
    });
  } catch (err) {
    console.error("Error in login handler:", err);
    return res.status(500).json({ success: false, message: "Internal server error" });
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
import upload from "@/middlewares/imageUpload.middleware";
import { createRouter, nc } from "next-connect";
import User from "@/models/User";
import dbConnect from "@/utils/dbconnect";
import authMiddleware from "@/middlewares/auth.middleware";
import bcrypt from "bcryptjs";
import bodyParser from "body-parser";

const router = createRouter();
dbConnect();

router.use(authMiddleware);

router.use(bodyParser.json());

router.get(async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const userProfilePic = await User.findById(req.user.userId).select(
      "profilePicUrl"
    );

    if (userProfilePic && userProfilePic.profilePicUrl) {
      return res
        .status(200)
        .json({ success: true, filePath: userProfilePic.profilePicUrl });
    } else {
      return res
        .status(404)
        .json({ success: false, message: "Profile picture not found" });
    }
  } catch (err) {
    console.error("Error in profile handler:", err);
    res.status(500).json({ success: false });
  }
});

router.put(async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.userId).select("+password");

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Check for current password match
    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) return res.status(401).json({ msg: "Incorrect password" });

    if (newPassword.length < 6) {
      return res
        .status(400)
        .json({ msg: "Password must be atleast 8 characters long" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.status(200).json({ msg: "Password Changed Successfully" });
  } catch (err) {
    console.log("BE RESET PW:", err);
    res.status(500).json({ success: false, message: "Reset Password Error" });
  }
});

router.use(upload.single("profilePic")); // middleware for single file upload

router.post((req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  return res.status(200).json({
    message: "Image uploaded successfully!",
    filePath: req.file.path,
  });
});

export const config = {
  api: {
    bodyParser: false, // Disallow Next.js body parsing (multer handles it)
  },
};

export default router.handler({
  onError: (err, req, res) => {
    console.error(err);
    res.status(500).end("Something went wrong!");
  },
});

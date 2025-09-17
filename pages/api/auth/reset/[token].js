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

router.post(async (req, res) => {

  const {token} = req.query
  const {newPassword} = req.body
  try {
    
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    })
    
    if (!user) {
      return res.status(404).json({ msg: "Token Expired" });
    }
    
    //Setting new password
    user.password = await bcrypt.hash(newPassword, 10)
    user.resetPasswordToken = undefined
    user.resetPasswordExpires = undefined
    await user.save()
    
    return res.status(200).json({msg: "Password Reset complete."});
  } catch (err) {
   return res.status(500).json({msg: "Server Error at PW Reset."}) 
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

import { createRouter, nc } from "next-connect";
import User from "@/models/User";
import dbConnect from "@/utils/dbconnect";
import bodyParser from "body-parser";
import readHTML from "@/utils/readHTML";
import sendEmail from "@/utils/sendEmail";
import crypto from "crypto";
import handlebars from "handlebars";

const router = createRouter();
dbConnect();

// router.use(authMiddleware);

router.use(bodyParser.json());

// router.use(upload.single("profilePic")); // middleware for single file upload

router.post(async (req, res) => {
  const { email } = req.body.data;
  try {
    // check if user exists
    const checkUser = await User.findOne({ email: email });

    if (!checkUser) {
      return res.status(404).json({ msg: "User Does not Exist's" });
    }

    const resetToken = crypto.randomBytes(20).toString("hex");

    checkUser.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    checkUser.resetPasswordExpires = Date.now() + 10 * 60 * 1000; //10 min expire time

    const resetURL =
      process.env.NEXT_PUBLIC_FE_API_URL +
      `/forgotpassword/${checkUser.resetPasswordToken}`;

    const htmlTemplate = await readHTML("./emails/forgot-password.html");

    const handleTemplate = handlebars.compile(htmlTemplate);
    const replacements = { resetURL };
    const html = handleTemplate(replacements);

    try {
      await sendEmail({
        to: checkUser.email,
        subject: "Notes App - Forgot Password",
        html,
      });
    } catch (err) {
      console.log(err);
      checkUser.resetPasswordToken = undefined;
      checkUser.resetPasswordExpires = undefined;
      await checkUser.save();
      return res.status(500).json({ msg: "Email Provider Error" });
    }

    await checkUser.save();

    return res.status(200).json({ msg: "Please Check Your Mail!" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: "Server error at FGPW" });
  }
});

export default router.handler({
  onError: (err, req, res) => {
    console.error(err);
    return res.status(500).end("Something went wrong!");
  },
});

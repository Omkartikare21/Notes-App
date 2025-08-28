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








// router.post('/', imageUpload.single('coverPic'), async (req, res) => {
//   const { name, username, email, password, phone_number,
//     userign, gameId , avatarImage, country, coverPic, gender } = req.body;

//   const { bio, techStack, social } = req.body;
  
//   if (password.length < 6) {
//     return res
//       .status(400)
//       .json({ msg: 'Password must be atleast 8 characters long' });
//   }

//   try {
//     // Check if user is already registered
//     let user = await User.findOne({ email: email.toLowerCase() });
//     if (user) {
//       return res.status(400).json({ msg: 'You are already registered' });
//     }

//     // Check if username is already taken
//     user = await User.findOne({ username: username.toLowerCase() });
//     if (user) {
//       return res.status(400).json({ msg: 'Username is already taken' });
//     }

//     user = new User({
//       name,
//       email: email.toLowerCase(),
//       username: username,
//       password,
//       phone_number,
//       country
//     });

//     // Hash the password
//     user.password = await bcrypt.hash(password, 10);

//     // Send verification email
//     let vt = crypto.randomBytes(3).toString('hex')
//     const verificationToken = parseInt(vt.toString('hex'),16).toString().substr(0,6)

//     user.verificationToken = crypto
//       .createHash('sha256')
//       .update(verificationToken)
//       .digest('hex');

//    // const verificationUrl = `${req.protocol}://${req.get('host')}/onboarding/${verificationToken}`;
//      const verificationUrl = process.env.FE_NEXT_API_URL + `/confirm/${verificationToken}`;

//     const htmlTemplate = await readHTML(
//       path.join(__dirname, '..', 'emails', 'verify-email.html')
//     );
//     const handlebarsTemplate = handlebars.compile(htmlTemplate);
//     const replacements = { verificationToken };
//     const html = handlebarsTemplate(replacements);

//     try {
//         await sendEmail({ 
//           to: user.email,
//           subject: 'Multiplayr - Account Verification',
//           html,
//         });
//     } catch (err) {
//       console.log(err);
//       user.verificationToken = undefined;
//       await user.save();
//       return res.status(500).json({ msg: 'Error sending verification email' });
//     }

//     if (req.file) {
//       user.profilePicUrl = req.file?.path
//     }else{
//       user.profilePicUrl = avatarImage
//     }

//     await user.save();

//     // Initailise Address (Check if we need this or we can remove)
//     // let addressFields = {}
//     // const address = await new Address(addressFields).save()
    
//     // Create profile
//     let profileFields = {};
//     profileFields.user = user._id;
//     // profileFields.address = address._id
//     profileFields.bio = bio;
//     profileFields.techStack = []; //JSON.parse(techStack);
//     profileFields.badges = [];

//     profileFields.social = {};
//     profileFields.gender = gender

//     if(userign !== ''){
//       let pgs = [];
//       pgs.push({game : gameId, userign:userign});
//       profileFields.playergames = pgs;
//     }

//     await new Profile(profileFields).save();

//     // Sign JWT and return token
//     jwt.sign({ userId: user._id }, process.env.JWT_SECRET, (err, token) => {
//       if (err) throw err;
//       res.status(200).json({
//         msg: 'Please check your email to verify your registration',
//         token,
//         verificationToken
//       });
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ msg: 'Server error' });
//   }
// });
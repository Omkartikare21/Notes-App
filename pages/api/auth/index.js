// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import User from "@/models/User";
import dbConnect from "@/utils/dbconnect";

dbConnect();

// Example middleware function
const logger = (handler) => async (req, res) => {
  console.log(`Incoming request for AUTH: ${req.method} ${req.url}`);
  return handler(req, res);
};

const handler = async (req, res) => {
  const { method } = req;

  switch (method) {
    case "GET":
      try {
        const notes = await User.find({email: req.body.email});
        res.status(200).json({ success: true, data: notes });
      } catch (err) {
        res.status(400).json({ success: false });
      }
      break;
    case "POST":
      try {


        console.log("This is index js wrong", req.body);
        
        // const note = await Notes.create(req.body);
        res.status(201).json({ success: true, data: [] });
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

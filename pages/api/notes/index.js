// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import Notes from "@/models/Notes";
import dbConnect from "@/utils/dbconnect";
import authMiddleware from "@/middlewares/auth.middleware";
import User from "@/models/User";

dbConnect();

// Example middleware function
const logger = (handler) => async (req, res) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  return handler(req, res);
};

const handler = async (req, res) => {
  await authMiddleware(req, res);
  const { method } = req;

  if (!req.user) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  switch (method) {
    case "GET":
      try {
        const user = await User.findById(req.user.userId);

        const notes = await Notes.find({
          author: user?.id,
        }).populate({ path: "author", select: { name: 1 } });

        if (!notes) {
          return res
            .status(404)
            .json({ success: false, message: "No notes found" });
        }

        return res
          .status(200)
          .json({
            success: true,
            data: notes,
            user: user.name,
            userImg: user.profilePicUrl,
          });
      } catch (err) {
        console.error("Error fetching notes 1:", err);
        return res.status(400).json({ success: false });
      }
      break;
    case "POST":
      try {
        const note = await Notes.create({
          title: req.body.title,
          description: req.body.description,
          author: req.user.userId,
        });
        await note.save();

        return res.status(201).json({ success: true, data: note });
      } catch (err) {
        console.log("Error creating note 2:", err);
        return res.status(400).json({ success: false });
      }
      break;
    default:
      console.error("Error fetching notes 3:", err);
      return res.status(400).json({ success: false });
      break;
  }
};

// Wrap your handler with the middleware
export default logger(handler);

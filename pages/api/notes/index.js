import Notes from "@/models/Notes";
import dbConnect from "@/utils/dbconnect";
import authMiddleware from "@/middlewares/auth.middleware";
import User from "@/models/User";
import { createRouter } from "next-connect";

dbConnect();

const router = createRouter();

router.use(authMiddleware);

router.get(async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const user = await User.findById(req.user.userId);
    
    const notes = await Notes.find({
      author: user._id,
    }).populate({ path: "author", select: { name: 1, profilePicUrl: 1 } });

    if (!notes) {
      return res.status(404).json({ success: false, message: "No notes found" });
    }

    return res.status(200).json({
      success: true,
      data: notes,
      user: user.name,
      userImg: user.profilePicUrl,
    });
  } catch (err) {
    console.error("Error fetching notes:", err);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
});

router.post(async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const note = await Notes.create({
      title: req.body.title,
      description: req.body.description,
      author: req.user.userId,
    });

    await note.save();

    return res.status(201).json({ success: true, data: note });
  } catch (err) {
    console.log("Error creating note:", err);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
});

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
};

export default router.handler({
  onError: (err, req, res) => {
    console.error(err);
    return res.status(500).end("Something went wrong!");
  },
});

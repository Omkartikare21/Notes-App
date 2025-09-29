import { createRouter, nc } from "next-connect";
import Notes from "@/models/Notes";
import dbConnect from "@/utils/dbconnect";
import authMiddleware from "@/middlewares/auth.middleware";
import bodyParser from "body-parser";

const router = createRouter();
dbConnect();

router.use(authMiddleware);
router.use(bodyParser.json())

router.get(async (req, res) => {
  try {
    const note = await Notes.findById(req.query.id)
      .populate({ path: 'author', select: {'name': 1} });

        if (!note) {
          return res.status(404).json({ success: false, message: "Note not found" });
        }

        return res.status(200).json({ success: true, data: note });
      } catch (err) {
    console.log("Notes GET ERR", err);
    return res.status(500).json({ success: false, msg: "SERVER ERR at NOTES/ID" });
      }
});

router.put(async (req, res) => {
      try {
        const updatedNote = await Notes.findByIdAndUpdate(
          req.query.id,
          req.body,
          {
            new: true,
            runValidators: true,
          }
        ).populate({ path: 'author', select: {'name': 1} });
        
    if (!updatedNote) {
          return res.status(400).json({ success: false });
        }

    return res.status(200).json({ success: true, data: updatedNote });
      } catch (err) {
        console.log("Notes PUT ERR", err);
    return res.status(500).json({ success: false });
      }
});

router.delete(async (req, res) => {
      try {
    const deleteNote = await Notes.deleteOne({ _id: req.query.id });

        if (!deleteNote) {
          return res.status(400).json({ success: false });
        }

        return res.status(200).json({ success: true, data: {} });
      } catch (err) {
    console.log("Notes DELETE ERR", err);
    return res.status(500).json({ success: false });
      }
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default router.handler({
  onError: (err, req, res) => {
    console.error(err);
    return res.status(500).end("Something went wrong!");
  },
});


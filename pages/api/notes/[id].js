// this file is also know as dynamic routing page as it take the id of a particular and process it
import dbConnect from "@/utils/dbconnect";
import Notes from "@/models/Notes";
import authMiddleware from "@/middlewares/auth.middleware";

dbConnect();

// Example middleware function
const logger = (handler) => async (req, res) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  return handler(req, res);
};

const handler = async (req, res) => {
  // const {
  //   query: { id }, //this "query" will take ID after "api/notes", we are destructuring "ID" and "method" here
  //   method,
  // } = req;

      const { method } = req;
      const { id } = req.query;
      await authMiddleware(req, res)

  switch (method) {
    case "GET":
      try {
        const note = await Notes.findById(id).populate({ path: 'author', select: {'name': 1} });

        if (!note) {
          return res.status(404).json({ success: false, message: "Note not found" });
        }

        return res.status(200).json({ success: true, data: note });
      } catch (err) {
        return res.status(400).json({ success: false, data: "Error fetching note" });
      }
      break;
    case "PUT":
      try {
        const note = await Notes.findByIdAndUpdate(id, req.body, {
          // we pass the req.body to get the updated text and then we pass this object
          new: true, // it is for new value i guess
          runValidators: true, // we chect the validation on the updated value
        }).populate({ path: 'author', select: {'name': 1} });

        if (!note) {
          return res.status(400).json({ success: false });
        }

        return res.status(200).json({ success: true, data: note });
      } catch (err) {
        console.log("Notes PUT ERR", err);
        return res.status(400).json({ success: false });
      }
      break;
    case "DELETE":
      try {
        const deleteNote = await Notes.deleteOne({ _id: id });

        if (!deleteNote) {
          return res.status(400).json({ success: false });
        }

        return res.status(200).json({ success: true, data: {} });
      } catch (err) {
        return res.status(400).json({ success: false });
      }
      break;
    default:
      return res.status(400).json({ success: false });
      break;
  }
};

export default logger(handler);

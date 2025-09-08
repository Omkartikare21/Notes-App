const cloudinary = require("cloudinary").v2;

const deleteCloudinaryImage = async (publicId) => {
  if (!publicId) return;
  try {
    await cloudinary.uploader.destroy(publicId);
    return;
  } catch (error) {
    console.error("[Cloudinary] Delete error:", error.message);
  }
};

const getPublicId = async (url) => {
  // Remove base URL and version
  // Example URL: https://res.cloudinary.com/demo/image/upload/v1234567890/NotesProfilePic/xttur2di6fyxeIIacnvk.jpg
  const parts = url.split("/");
  // Find the index of 'upload' which precedes public_id path
  const uploadIndex = parts.findIndex((part) => part === "upload");
  // public_id with folder and without extension
  const publicIdWithExtension = parts.slice(uploadIndex + 2).join("/"); // NotesProfilePic/xttur2di6fyxeIIacnvk.jpg
  // remove file extension
  const lastDot = publicIdWithExtension.lastIndexOf(".");
  return lastDot !== -1
    ? publicIdWithExtension.substring(0, lastDot) // NotesProfilePic/xttur2di6fyxeIIacnvk
    : publicIdWithExtension;
};

module.exports = { deleteCloudinaryImage, getPublicId };

const mongoose = require("mongoose");

const accountSchema = new mongoose.Schema({
  provider: {
    type: String,
  },
  type: {
    type: String,
  },
  providerAccountId: {
    type: String,
    required: true,
  },
  access_token: {
    type: String,
  },
  expires_at: {
    type: Number,
  },
  scope: {
    type: String,
  },
  token_type: {
    type: String,
  },
  id_token: {
    type: String,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = mongoose.models.Accounts || mongoose.model("Accounts", accountSchema);
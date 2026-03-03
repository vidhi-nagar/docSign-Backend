import mongoose from "mongoose";
import User from "./User.js";

const documentSchema = new mongoose.Schema({
  // title: { type: String, required: true },
  filePath: { type: String, required: true },
  signFilePath: { type: String, default: "" },
  signer: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  status: { type: String, default: "Pending" },
  recipientEmail: { type: String },
  signatureToken: { type: String },
  // x: { type: Number, default: 0 },
  // y: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

// const DocumnetSchema = mongoose.model("Document", documentSchema);

const DocumnetSchema =
  mongoose.models.Document || mongoose.model("Document", documentSchema);

export default DocumnetSchema;

import mongoose from "mongoose";

const signatureSchema = new mongoose.Schema({
  fileId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Document",
    required: true,
  },
  signFilePath: { type: String, required: true },
  x: { type: Number, required: true },
  y: { type: Number, required: true },
  signer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  status: { type: String, enum: ["pending", "signed"], default: "signed" },
  createdAt: { type: Date, default: Date.now },
});

// const SignatureSchema = mongoose.model("Signature", signatureSchema);
const SignatureSchema =
  mongoose.models.Signature || mongoose.model("Signature", signatureSchema);

export default SignatureSchema;

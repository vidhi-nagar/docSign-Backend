import SignatureSchema from "../models/SignatureModel.js";
import Document from "../models/documentModel.js";

export const uploadSignPdf = async (req, res) => {
  const { documentId, x, y, signerId } = req.body;

  try {
    // const { documentId, x, y } = req.body;

    const userId = req.user ? req.user.id : signerId;

    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "Signed file missing" });
    }

    const finalSignerId = req.user
      ? req.user.id
      : signerId === "EXTERNAL USER"
        ? null
        : signerId;

    const newSign = new SignatureSchema({
      fileId: documentId,
      signFilePath: req.file.path, // Cloudinary URL
      signer: finalSignerId,
      x: Number(x) || 0,
      y: Number(y) || 0,
      status: "signed",
    });

    await newSign.save();
    await Document.findByIdAndUpdate(documentId, {
      status: "signed",
      signFilePath: req.file.path, // Dashboard download ke liye
    });
    // Original Document ka status 'signed' kar do taaki dashboard par update dikhe
    // await Document.findByIdAndUpdate(documentId, { status: "signed" });

    res.json({ success: true, message: "Signed PDF Saved Successfully!" });
    // if (!fileId || x === undefined || y === undefined) {
    //   return res.json({ success: false, message: "Missing Data" });
    // }

    // const newSignPdf = new SignatureSchema({ fileId, x, y, signer });

    // await newSignPdf.save();

    // return res.json({ success: true, message: "Signature Pdf saved!" });
  } catch (error) {
    console.log("sign controller error:", error);
    return res.json({ message: error.message });
  }
};

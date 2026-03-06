import Document from "../models/documentModel.js";
import Signature from "../models/SignatureModel.js"; // Signature model import karein
import crypto from "crypto";
import sendEmail from "./sendEmail.js";

export const uploadDocument = async (req, res) => {
  try {
    const newDoc = new Document({
      filePath: req.file.path,
      signer: req.user.id, // Upload karne wala
      status: "Pending",
    });
    const saved = await newDoc.save();
    res.json({ success: true, data: saved });
  } catch (error) {
    console.error("Upload Error:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const saveSignature = async (req, res) => {
  try {
    const { documentId, x, y } = req.body;

    if (!req.file)
      return res
        .status(400)
        .json({ success: false, message: "Signed file missing" });

    const newSign = new Signature({
      fileId: documentId,
      signFilePath: req.file.path,
      signer: req.user.id,
      x: x || 0,
      y: y || 0,
      status: "signed",
    });

    await newSign.save();

    // Original Document ka status update karein
    await Document.findByIdAndUpdate(documentId, { status: "signed" });

    res.json({ success: true, message: "Signed PDF Saved Successfully!" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// --- Dashboard Fetch Logic (Corrected) ---
export const fetchUserDocuments = async (req, res) => {
  try {
    const userId = req.user.id; // ensure req.user.id exists via middleware

    // Sirf documents find karne hain
    const documents = await Document.find({ signer: userId });

    res.json({ success: true, data: documents });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export const fetchSignedDocuments = async (req, res) => {
  try {
    const userId = req.user.id;

    // Signature table se wo saare records nikaalein jo is user ne sign kiye hain
    // .populate("fileId") se humein original document ka data bhi mil jayega
    const signedDocs = await Signature.find({ signer: userId })
      .populate("fileId")
      .sort({ createdAt: -1 });

    console.log("Signed Docs Found:", signedDocs.length);

    return res.json({
      success: true,
      data: signedDocs,
    });
  } catch (error) {
    console.error("Fetch Signed Docs Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const sendSignatureRequest = async (req, res) => {
  const { documentId, recipientEmail } = req.body;

  console.log("REQ BODY:", req.body);
  console.log("recipientEmail:", recipientEmail);
  console.log("documentId:", documentId);

  try {
    const token = crypto.randomBytes(32).toString("hex");

    // document.signingToken = token;

    // DB Update
    const updatedDoc = await Document.findByIdAndUpdate(
      documentId,
      {
        recipientEmail,
        signatureToken: token,
        status: "Waiting for Signature",
      },
      { new: true },
    );

    if (!updatedDoc) {
      return res
        .status(404)
        .json({ success: false, message: "Document not found" });
    }
    // await document.save();
    // DYNAMIC LINK: Ye automatic backend environment se URL uthayega
    const frontendBaseUrl = process.env.FRONTEND_URL; // || "http://localhost:5173";
    const signLink = `${frontendBaseUrl}/sign-external/${token}`;

    await sendEmail(recipientEmail, "Signature Required", signLink);

    res.json({ success: true, message: "Request sent to " + recipientEmail });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getDocumentByToken = async (req, res) => {
  const { token } = req.params;
  try {
    const document = await Document.findOne({ signatureToken: token });
    if (!document) {
      return res
        .status(404)
        .json({ success: false, message: "Invalid or expired token" });
    }

    if (document.status === "signed") {
      return res.status(400).json({
        success: false,
        message: "Ye document pehle hi sign kiya ja chuka hai.",
      });
    }

    const safeData = {
      _id: document._id,
      name: document.name,
      filePath: document.filePath, // PDF path jo editor mein dikhega
    };

    res.json({ success: true, data: document });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

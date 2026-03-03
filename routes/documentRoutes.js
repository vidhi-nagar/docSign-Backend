import express from "express";
import { userAuth } from "../middlewear/auth.js";
import { upload } from "../middlewear/multer.js";
import {
  fetchSignedDocuments,
  sendSignatureRequest,
  uploadDocument,
} from "../contollers/documentController.js";

const docRouter = express.Router();

docRouter.post("/upload", userAuth, upload.single("pdf"), uploadDocument);
docRouter.get("/all", userAuth, fetchSignedDocuments);
docRouter.post("/send-email-invite", userAuth, sendSignatureRequest);

export default docRouter;

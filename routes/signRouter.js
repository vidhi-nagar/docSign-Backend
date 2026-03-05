import express from "express";
import { uploadSignPdf } from "../controllers/signController.js";
import { upload } from "../middlewear/multer.js";
import { userAuth } from "../middlewear/auth.js";
import { getDocumentByToken } from "../controllers/documentController.js";

const signRouter = express.Router();

signRouter.post(
  "/signature-save",
  userAuth,
  upload.single("pdf"),
  uploadSignPdf,
);
signRouter.get("/public/:token", getDocumentByToken);
export default signRouter;

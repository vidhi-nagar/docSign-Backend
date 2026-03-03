import express from "express";
import { uploadSignPdf } from "../contollers/signController.js";
import { upload } from "../middlewear/multer.js";
import { userAuth } from "../middlewear/auth.js";
import { getDocumentByToken } from "../contollers/documentController.js";

const signRouter = express.Router();

signRouter.post(
  "/signature-save",
  userAuth,
  upload.single("pdf"),
  uploadSignPdf,
);
signRouter.get("/public/:token", getDocumentByToken);
export default signRouter;

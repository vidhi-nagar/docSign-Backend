import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import dotenv from "dotenv";

// dotenv.config();

console.log("Cloud Key Check:", process.env.CLOUD_KEY);

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME, //"dmgrseg2x",
  api_key: process.env.CLOUD_KEY, // 665585677481434,
  api_secret: process.env.CLOUD_SECRET, //"m8AQ3cvWF1NvTZsnMSiiD9lARDU",
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "pdfStorage",
    resource_type: "auto",
    // format: async (req, file) => "pdf", //file ka type
    public_id: (req, file) => file.fieldname + "-" + Date.now(),
  },
});

export const upload = multer({
  storage: storage,
  limits: { fileSize: 100 * 1024 * 1024 },
});

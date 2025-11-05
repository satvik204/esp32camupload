import express from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";


dotenv.config();
const app = express();
const port = process.env.PORT || 3000;
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = multer.memoryStorage();
const upload = multer({storage});

app.post("/upload",upload.single("image"),(req,res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const result = await cloudinary.uploader.upload_stream(
      { folder: "esp32-cam" },
      (error, result) => {
        if (error) return res.status(500).json({ error: error.message });
        res.json({
          message: "✅ Image uploaded successfully!",
          url: result.secure_url,
        });
      }
    );

    // Pipe the file buffer to Cloudinary upload stream
    require("streamifier").createReadStream(req.file.buffer).pipe(result);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
})

app.use("/photos", express.static("uploads"));

app.use("/",(req,res) => {
    const files = fs.readdirSync("uploads");
    const gallery = files.map((f) => `<div style="margin:10px;display:inline-block;"><img src="/photos/${f}" width="300"><br>${f}</div>`).join("")
    res.send(`<h1>📷 ESP32-CAM Photo Gallery</h1>${gallery}`);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
import express from "express";
import fs from "fs";
import multer from "multer";
import path from "path";

const app = express();

const upload = multer({dest: "uploads/ "});

app.post("/upload",upload.single("photo"),(req,res) => {
console.log("Photo received");
res.send("Photo uploaded successfully");
})

app.use("/photos", express.static("uploads"));

app.use("/",(req,res) => {
    const files = fs.readdirSync("uploads");
    const gallery = files.map((f) => `<div style="margin:10px;display:inline-block;"><img src="/photos/${f}" width="300"><br>${f}</div>`).join("")
    res.send(`<h1>📷 ESP32-CAM Photo Gallery</h1>${gallery}`);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
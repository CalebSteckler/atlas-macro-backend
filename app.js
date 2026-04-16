const path = require("path");
const fs = require("fs");
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const Joi = require("joi");
const mongoose = require("mongoose");

const URI = `mongodb+srv://CalebSteckler:izrRyGa4OVruDqIR@cluster0.rvj9jji.mongodb.net/?appName=Cluster0`;

const app = express();
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "http://localhost:5500",
  "http://127.0.0.1:3000",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:5500",
  "https://calebsteckler.github.io",
];

app.use(
  cors({
    origin(origin, cb) {
      if (!origin) return cb(null, true);
      return cb(null, allowedOrigins.includes(origin));
    },
  })
);

const imagesDir = path.join(__dirname, "public", "images");
fs.mkdirSync(imagesDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    fs.mkdirSync(imagesDir, { recursive: true });
    cb(null, imagesDir);
  },
  filename: (_req, file, cb) => {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });


mongoose
  .connect(URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("Could not connect to MongoDB", error));

const reportSchema = new mongoose.Schema({
  title: String,
  author: String,
  description: String,
  date: String,
  category: String,
  image: String,
});

const Report = mongoose.model("Report", reportSchema);

app.get("/api/reports", async (_req, res) => {
  const reports = await Report.find();
  console.log("MONGODB GET Request Received");
  res.send(reports);
});

app.get("/api/reports/:id", async (req, res) => {
  const report = await Report.findById(req.params.id);

  if (!report) {
    return res.status(404).send("Report not found");
  }

  console.log("MONGODB GET Request Received");
  return res.send(report);
});

app.post("/api/reports", upload.single("img"), async (req, res) => {
  console.log("MONGODB POST Request Received");
  const result = validateReport(req.body);

  if (result.error) {
    return res.status(400).send(result.error.details[0].message);
  }

  const report = new Report({
    title: req.body.title,
    author: req.body.author,  
    description: req.body.description || "",
    date: req.body.date,
    category: req.body.category,
    image: req.body.image || "image-not-uploaded",
  });

  if (req.file) {
    report.image = "images/" + req.file.filename;
  }

  const newReport = await report.save();
  return res.send(newReport);
});

app.put("/api/reports/:id", upload.single("img"), async (req, res) => {
  console.log("MONGODB PUT Request Received");
  const result = validateReport(req.body);

  if (result.error) {
    return res.status(400).send(result.error.details[0].message);
  }

  const report = await Report.findById(req.params.id);
  if (!report) {
    return res.status(404).send("Report not found");
  }

  const fieldsToUpdate = {
    title: req.body.title,
    author: req.body.author,
    description: req.body.description || "",
    date: req.body.date,
    category: req.body.category,
  };

  if (req.file) {
    fieldsToUpdate.image = "images/" + req.file.filename;
  } else if (req.body.image) {
    fieldsToUpdate.image = req.body.image;
  }

  const updatedReport = await Report.findByIdAndUpdate(req.params.id, fieldsToUpdate, {
    new: true,
  });
  return res.send(updatedReport);
});

app.delete("/api/reports/:id", async (req, res) => {
  console.log("MONGODB DELETE Request Received");

  const deletedReport = await Report.findByIdAndDelete(req.params.id);
  if (!deletedReport) {
    return res.status(404).send("Report not found");
  }

  return res.send(deletedReport);
});

const validateReport = (report) => {
  const schema = Joi.object({
    _id: Joi.allow(""),
    title: Joi.string().min(1).required(),
    author: Joi.string().min(1).required(),
    description: Joi.allow(""),
    date: Joi.string().min(1).required(),
    category: Joi.string().min(1).required(),
    image: Joi.allow(""),
  });

  return schema.validate(report);
};

app.use((err, _req, res, _next) => {
  if (err) {
    return res.status(500).json({ error: err.message || "Internal server error" });
  }
});

//listen for incoming requests
const port = process.env.PORT || 3001;
app.listen(port, "0.0.0.0", () => {
  console.log(`Server is up and running on ${port}`);
});

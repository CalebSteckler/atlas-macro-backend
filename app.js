const path = require("path");
const fs = require("fs");
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const Joi = require("joi");

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

let reports = [
    {
        "_id": 1,
        "title": "Report 1",
        "author": "Author 1",
        "description": "",
        "date": "2024-01-01",
        "category": "",
        "image": "report-icon.png"
    },
    {
        "_id": 2,
        "title": "Report 2",
        "author": "Author 2",
        "description": "",
        "date": "2024-01-01",
        "category": "",
        "image": "report-icon.png"
    },
    {
        "_id": 3,
        "title": "Report 3",
        "author": "Author 3",
        "description": "",
        "date": "2024-01-01",
        "category": "",
        "image": "report-icon.png"
    },
    {
        "_id": 4,
        "title": "Report 4",
        "author": "Author 4",
        "description": "",
        "date": "2024-01-01",
        "category": "",
        "image": "report-icon.png"
    },
    
    {
        "_id": 5,
        "title": "Report 5",
        "author": "Author 5",
        "description": "",
        "date": "2024-01-01",
        "category": "",
        "image": "report-icon.png"
    },
    {
        "_id": 6,
        "title": "Report 6",
        "author": "Author 6",
        "description": "",
        "date": "2024-01-01",
        "category": "",
        "image": "report-icon.png"
    },
    {
        "_id": 7,
        "title": "Report 7",
        "author": "Author 7",
        "description": "",
        "date": "2024-01-01",
        "category": "",
        "image": "report-icon.png"
    },
    {
        "_id": 8,
        "title": "Report 8",
        "author": "Author 8",
        "description": "",
        "date": "2024-01-01",
        "category": "",
        "image": "report-icon.png"
    }
];

app.get("/api/reports", (_req, res) => {
  res.send(reports);
});

app.get("/api/reports/:id", (req, res) => {
  const report = reports.find((r) => r._id === parseInt(req.params.id));
  res.send(report);
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

app.post("/api/reports", upload.single("image"), (req, res) => {
  const result = validateReport(req.body);
  console.log("POST Request Received");

  if (result.error) {
    res.status(400).send(result.error.details[0].message);
    return;
  }

  const report = {
    _id: reports.length + 1,
    title: req.body.title,
    author: req.body.author,
    description: req.body.description || "",
    date: req.body.date,
    category: req.body.category,
  };

  if (req.file) {
    report.image = req.file.filename;
  } else {
    report.image = req.body.image || "image-not-uploaded";
  }

  reports.push(report);
  res.status(200).send(report);
});

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

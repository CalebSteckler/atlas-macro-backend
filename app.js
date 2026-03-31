const express = require("express");
const cors = require("cors");
const multer = require("multer");
const app = express();
app.use(express.static("public"));
app.use(express.json());
app.use(cors());


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "./public/images/");
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname);
    },
  });
  
  const upload = multer({ storage: storage });

let reports = [
    {
        "id": 1,
        "title": "Report 1",
        "author": "Author 1",
        "date": "2024-01-01",
        "img": "report-icon.png"
    },
    {
        "id": 2,
        "title": "Report 2",
        "author": "Author 2",
        "date": "2024-01-01",
        "img": "report-icon.png"
    },
    {
        "id": 3,
        "title": "Report 3",
        "author": "Author 3",
        "date": "2024-01-01",
        "img": "report-icon.png"
    },
    {
        "id": 4,
        "title": "Report 4",
        "author": "Author 4",
        "date": "2024-01-01",
        "img": "report-icon.png"
    },
    
    {
        "id": 5,
        "title": "Report 5",
        "author": "Author 5",
        "date": "2024-01-01",
        "img": "report-icon.png"
    },
    {
        "id": 6,
        "title": "Report 6",
        "author": "Author 6",
        "date": "2024-01-01",
        "img": "report-icon.png"
    },
    {
        "id": 7,
        "title": "Report 7",
        "author": "Author 7",
        "date": "2024-01-01",
        "img": "report-icon.png"
    },
    {
        "id": 8,
        "title": "Report 8",
        "author": "Author 8",
        "date": "2024-01-01",
        "img": "report-icon.png"
    }
]

app.get("/api/reports",(req,res)=>{
    console.log("GET request received for reports");
    res.send(reports);
});

app.get("/api/reports/:id", (req,res)=>{
    const report=reports.find((r)=>r.id===parseInt(req.params.id));
    res.send(report);
    console.log(req.params.id);
});



//listen for incoming requests
app.listen(3001, () => {
    console.log("Server is running on port 3001");
});

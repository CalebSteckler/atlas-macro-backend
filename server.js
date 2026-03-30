const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());

const port = process.env.PORT || 3000;
const mongoUri = process.env.MONGODB_URI;

if (!mongoUri) {
  console.error("MONGODB_URI is not set.");
  process.exit(1);
}

const messageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  instructions: String,
});

const Message = mongoose.model("Message", messageSchema);

app.get("/", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

app.post("/messages", async (req, res) => {
  try {
    const { name, description, instructions } = req.body;
    const message = new Message({ name, description, instructions });
    const saved = await message.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

async function startServer() {
  try {
    await mongoose.connect(mongoUri);
    console.log("Connected to mongodb...");
    app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  } catch (error) {
    console.error("Could not connect to mongodb...", error);
    process.exit(1);
  }
}

startServer();

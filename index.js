const mongoose = require("mongoose");

//testdb is name of database, it will automatically make it
mongoose
  .connect("mongodb+srv://CalebSteckler:cHcbaSHjYuJSYJOG@cluster0.rvj9jji.mongodb.net/?appName=Cluster0")
  .then(() => console.log("Connected to mongodb..."))
  .catch((err) => console.error("could not connect ot mongodb...", err));

const schema = new mongoose.Schema({
  name: String,
  description: String,
  instructions: String
});

async function createMessage() {
  const result = await message.save();
  console.log(result);
  await mongoose.connection.close();
}

//this creates a Message class in our app
const Message = mongoose.model("Message", schema);
const message = new Message({
  name: "Hello World",
});

createMessage();
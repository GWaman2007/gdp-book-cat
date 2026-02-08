const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config();

const Books = require("./models/Books");

const app = express();
app.use(express.json());
app.use(express.static("public"));

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// Create Book
app.post("/books", async (req, res) => {
  const books = new Books(req.body);
  await books.save();
  res.json(books);
});

// Get all books
app.get("/books", async (req, res) => {
  const books = await Books.find().sort({ createdAt: -1 });
  res.json(books);
});

// Delete a Book
app.delete("/books/:id", async (req, res) => {
  await Books.findByIdAndDelete(req.params.id);
  res.json({ message: "Book deleted" });
});

// Update
app.patch("/books/:id", async (req, res) => {
  const updatedBook = await Books.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(updatedBook);
});
// Get favicon
app.get("/favicon.ico", async (res) => {
  return("/public/bcicon.ico");
});
app.listen(process.env.PORT, () => {
  console.log("Server running on http://localhost:5000");
});

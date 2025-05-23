const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Register a User
public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Check if both username and password are provided
  if (username && password) {
    // Check if the user does not already exist
    if (!isValid(username)) {
      // Add the new user to the users array
      users.push({ username: username, password: password });
      return res
        .status(200)
        .json({ message: "User successfully registered. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  // Return error if username or password is missing
  return res.status(404).json({ message: "Unable to register user." });
});

// Get the book list available in the shop
public_users.get("/", async function (req, res) {
  res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", async function (req, res) {
  const isbn = req.params.isbn;
  const book = await books[isbn];
  if (book) {
    res.send({ [isbn]: book });
  } else {
    res.status(404).json({ message: "Book not found" });
  }
});

// Get book details based on author
public_users.get("/author/:author", async function (req, res) {
  const author = req.params.author;
  const bookQuery = [];
  for (let i = 1; i <= 10; i++) {
    let book = await books[i];
    if (book) {
      bookAuthor = book.author;
      if (bookAuthor === author) {
        bookQuery.push(book);
      }
    }
  }
  if (bookQuery.length > 0) {
    res.send(bookQuery);
  }
  res.status(404).json({ message: "Book not found for this author" });
});

// Get all books based on title
public_users.get("/title/:title", async function (req, res) {
  const title = req.params.title;
  const bookQuery = [];
  for (let i = 1; i <= 10; i++) {
    let book = await books[i];
    if (book) {
      bookTitle = book.title;
      if (bookTitle === title) {
        bookQuery.push(book);
      }
    }
  }
  if (bookQuery.length > 0) {
    res.send(bookQuery);
  }
  res.status(404).json({ message: "Book not found for this title" });
});

// Get book review
public_users.get("/review/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book) {
    res.send(book.reviews);
  }
});

module.exports.general = public_users;

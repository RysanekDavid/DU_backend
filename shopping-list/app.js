require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const shoppingListRoutes = require("./routes/shoppingListRoute.js");

const app = express();

// Připojení k MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected..."))
  .catch((err) => console.log(err));

// Middleware pro parsování JSON
app.use(express.json());

// Připojení rout
app.use("/api/shoppingLists", shoppingListRoutes);

module.exports = app;

const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
dotenv.config();  //.ENV

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

//Routes
//Auth Route
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

// Restaurant route
const restaurantRoutes = require("./routes/restaurantRoutes");
app.use("/api/restaurants", restaurantRoutes);

//Error Handler
const errorHandler = require("./middlewares/errorHandler");
app.use(errorHandler);

//Homepage of API
app.get("/", (req, res) => {
  res.status(200).send("Welcome to the Restaurant-API");
});

const port = process.env.PORT || 4000;

connectDB().then(() => {
  app.listen(port, () => {
    console.log(`Server is running on PORT: ${port}`);
  });
});

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const app = express();
const PORT = 8000;

const userRouter = require("./routes/user");

//middlware for json raw data in body of postman
app.use(express.json());

//for supporting form data,using this middleware
app.use(express.urlencoded({ extended: false }));

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.get("/", (req, res) => {
  res.render("home");
});

app.use("/user", userRouter);

mongoose
  .connect("mongodb://localhost:27017/blogify")
  .then(() => {
    console.log("Mongodb Connected");
  })
  .catch((error) => {
    console.log(error);
  });

app.listen(PORT, () => {
  console.log(`node server running at ${PORT}`);
});

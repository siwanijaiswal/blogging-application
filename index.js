const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cookieParser = require("cookie-parser");

const app = express();
const PORT = 8000;

const userRouter = require("./routes/user");
const {
  checkForAuthenticationCookie,
} = require("./middlewares/authentication");

const blogRoute = require("./routes/blog");

//middlware for json raw data in body of postman
app.use(express.json());

//for supporting form data,using this middleware
app.use(express.urlencoded({ extended: false }));

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));

app.get("/", (req, res) => {
  res.render("home", {
    user: req.user,
  });
});

app.use("/user", userRouter);
app.use("/blog", blogRoute);

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

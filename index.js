require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cookieParser = require("cookie-parser");
const Blog = require("./models/blog");

const app = express();
const PORT = process.env.PORT || 8000;

const userRouter = require("./routes/user");
const {
  checkForAuthenticationCookie,
} = require("./middlewares/authentication");
const blogRoute = require("./routes/blog");

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

//middlware for json raw data in body of postman
app.use(express.json());

//for supporting form data,using this middleware
app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));

//to show images from public folder
app.use(express.static(path.resolve("./public")));

app.get("/", async (req, res) => {
  const allBlogs = await Blog.find({});
  res.render("home", {
    user: req.user,
    blogs: allBlogs,
  });
});

app.use("/user", userRouter);
app.use("/blog", blogRoute);

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Mongodb Connected");
  })
  .catch((error) => {
    console.log(error);
  });

app.listen(PORT, () => {
  console.log(`node server running at ${PORT}`);
});

const { Router } = require("express");
const User = require("../models/user");

const router = Router();

router.get("/signin", (req, res) => {
  return res.render("signin");
});

router.get("/signup", (req, res) => {
  return res.render("signup");
});

router.post("/signup", async (req, res) => {
  const { fullName, email, password } = req.body;
  await User.create({ fullName, email, password });
  res.redirect("/");
});

//this function may give error if password doesnot match, so keeping in try catch
router.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  try {
    const token = await User.matchPasswordAndGenerateToken(email, password);
    // we got token here, now we will create cookie and store token their.
    return res.cookie("token", token).redirect("/");
  } catch (error) {
    //render signin page is their is any error, handling error in nav.ejs
    return res.render("signin", { error: "Incorrect email or password" });
  }
});

router.get("/logout", (req, res) => {
  res.clearCookie("token").redirect("/");
});

module.exports = router;

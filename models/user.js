const { Schema, model } = require("mongoose");
const { createHmac, randomBytes } = require("node:crypto");
const { createTokenForUser } = require("../services/authentication");

//password hash using salt
const userSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
    },

    salt: {
      type: String,
      // required: true,
    },

    password: {
      type: String,
      required: true,
      unique: true,
    },

    profileImageURL: {
      type: String,
      default: "/images/default.jpg",
    },
  },

  { timeStamps: true }
);

//when we try to save user, firstly this function will be called first
//function to hash the password
userSchema.pre("save", function (next) {
  const user = this;
  if (!user.isModified("password")) return;

  const salt = randomBytes(16).toString();
  // const salt = "somerandomsalt";
  const hashedPassword = createHmac("sha256", salt)
    .update(user.password)
    .digest("hex");

  this.salt = salt;
  this.password = hashedPassword;

  next();
});

// const secret = "abcdefg";
// const hash = createHmac("sha256", secret)
//   .update("I love cupcakes")
//   .digest("hex");
// console.log(hash);

//virtual function in mongoose matching if user password after hashed is same or not?
userSchema.static(
  "matchPasswordAndGenerateToken",
  async function (email, password) {
    const user = await this.findOne({ email });
    if (!user) throw new Error("User not found!");

    const salt = user.salt;
    const hashedPassword = user.password;
    const userProvidedHash = createHmac("sha256", salt)
      .update(password)
      .digest("hex");

    if (hashedPassword !== userProvidedHash)
      throw new Error("Incorrect Password");

    // return hashedPassword === userProvidedHash;
    // return user;

    //after password hasing, create token and return it
    const token = createTokenForUser(user);
    return token;
  }
);

const User = model("user", userSchema);
module.exports = User;

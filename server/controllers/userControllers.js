const user = require("../model/userModels");
const bcrypt = require("bcrypt");

// function to route register to save users information

module.exports.register = async (req, res, next) => {
  const { name, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const User = await user.create({
      name,
      email,
      password: hashedPassword,
    });
    delete password;
    return res.json({ status: true, User });
  } catch (error) {
    console.log(error.message);
    res.json(error.message);
    next(error.message);
  }
};
// functon to login route to check authentication details and login the user

module.exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  // console.log(req.body);
  try {
    const User = await user.findOne({ email });
    if (User) {
      const ValidPassword = await bcrypt.compare(password, User.password);
      if (ValidPassword) {
        return res.json({ status: true, User });
      }
      return res.json({ status: false, error: "Email or Password is Invalid" });
    } else {
      return res.json({ status: false, error: "User not Found" });
    }
  } catch (error) {
    console.log(error);
    return res.json({ status: false, error });
  }
};

// function to set avatar of the user by getting current user logged in from the localstorage

module.exports.setAvatar = async (req, res, next) => {
  const userID = req.params.id;
  const image = req.body.image;
  try {
    const UserData = await user.findByIdAndUpdate(userID, {
      isAvatarImageSet: true,
      avatarImage: image,
    });
    return res.json({ status: true, image: UserData.avatarImage });
  } catch (error) {
    res.json({ staus: false, error });
  }
};

// function to fetch all users from the database

module.exports.allContacts = async (req, res, next) => {
  const userID = req.params.id;
  try {
    const allUsers = await user.find({ _id: { $ne: userID } }).select([
      "email",
      "name",
      "avatarImage",
      "isAvatarImageSet ",
      "_id",
    ]);
    res.json({status:true,allUsers})
  } catch (error) {
    res.json({ status: false, error });
  }
};

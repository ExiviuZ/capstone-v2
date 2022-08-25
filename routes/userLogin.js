const express = require("express");
const router = express.Router();
const { notLoggedIn, loggedIn } = require("../middleware");
const { catchAsync } = require("../utils/errorHandler");
const User = require("../model/user");
const passport = require("passport");

router.get("/register", loggedIn, async (req, res) => {
  res.render("register", { title: "Register" });
});

router.post(
  "/register",
  catchAsync(async (req, res, next) => {
    try {
      const {
        firstName,
        lastName,
        email,
        username,
        street,
        city,
        province,
        password,
      } = req.body;
      const user = new User({
        firstName,
        lastName,
        email,
        username: username,
        address: {
          street,
          city,
          province,
        },
      });

      const registeredUser = await User.register(user, password);
      await user.save();
      req.login(registeredUser, (err) => {
        if (err) {
          return next(err);
        } else {
          req.flash("success", "Welcome To Your Dashboard!");
          res.redirect(`/user/profile`);
        }
      });
    } catch (err) {
      req.flash("error", err.message);
      res.redirect("/user/register");
    }
  })
);

router.get("/login", loggedIn, async (req, res) => {
  res.render("login", { title: "Login" });
});

router.post(
  "/login",
  (req, res, next) => {
    req.body.username = req.body.username.toLowerCase();
    next();
  },
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/user/login",
  }),
  async (req, res) => {
    req.flash("success", "Welcome Back!");
    res.redirect("/user/profile");
  }
);

router.get("/profile", notLoggedIn, async (req, res) => {
  console.log(req.user);
  res.render("profile");
});

router.get("/logout", async (req, res) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.flash("success", "See You Soon!");
    res.redirect("/");
  });
});
module.exports = router;

const notLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.flash("error", "Please login first.");
    return res.redirect("/user/login");
  }
  next();
};
const loggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    req.flash("error", "You are already logged in.");
    return res.redirect("/user/profile");
  }
  next();
};

module.exports = { notLoggedIn, loggedIn };

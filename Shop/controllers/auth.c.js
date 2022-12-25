exports.register = async (req, res, next) => {
  try {
    const isLogin = !!req.cookies.jwt;

    if (isLogin) {
      res.redirect("/");
    }

    res.render("register", { title: "Register", isLogin });
  } catch (error) {
    next(error);
  }
};
exports.login = async (req, res, next) => {
  try {
    const isLogin = !!req.cookies.jwt;

    if (isLogin) {
      res.redirect("/");
    }

    res.render("login", { title: "Login", isLogin });
  } catch (error) {
    next(error);
  }
};
exports.logout = async (req, res, next) => {
  try {
    const isLogin = !!req.cookies.jwt;

    if (isLogin) {
      res.clearCookie("jwt");
    }

    res.redirect("/login");
  } catch (error) {
    next(error);
  }
};

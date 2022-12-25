exports.isAuth = async (req, res, next) => {
  const verified = !!req.cookies.jwt;

  if (!verified) {
    return res.render("unauthorized", { title: "Unauthorized !" });
  }

  return next();
};

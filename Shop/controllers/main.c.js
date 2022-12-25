const hbs_helper = require("../helpers/hbs_helper");
const productModel = require("../models/product.m");

exports.home = async (req, res, next) => {
  try {
    const isLogin = !!req.cookies.jwt;

    const catID = req.query?.catID;

    const productList = catID
      ? await productModel.listByCat({ catID })
      : await productModel.list();
    const catList = await productModel.listCat();

    res.render("home", {
      title: "Home",
      isLogin,
      productList: productList.map(p => ({ ...p, isLogin })),
      catList,
      currentCat: catID,
      helpers: hbs_helper,
    });
  } catch (error) {
    next(error);
  }
};

exports.cart = async (req, res, next) => {
  try {
    const isLogin = !!req.cookies.jwt;

    const catID = req.query?.catID;

    const productList = catID
      ? await productModel.listByCat({ catID })
      : await productModel.list();
    const catList = await productModel.listCat();

    res.render("cart", {
      title: "Cart",
      isLogin,
      productList: JSON.stringify(productList),
      catList,
      currentCat: catID,
      helpers: hbs_helper,
    });
  } catch (error) {
    next(error);
  }
};

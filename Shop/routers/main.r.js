const app = require("express");
const router = app.Router();

const mainController = require("../controllers/main.c");
const { isAuth } = require("../middlewares/auth.middleware");

router.get("/", mainController.home);
router.get("/cart", isAuth, mainController.cart);

module.exports = router;

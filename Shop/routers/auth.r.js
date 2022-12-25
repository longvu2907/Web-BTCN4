const app = require("express");
const router = app.Router();

const authController = require("../controllers/auth.c");

router.get("/register", authController.register);
router.get("/login", authController.login);
router.get("/logout", authController.logout);

module.exports = router;

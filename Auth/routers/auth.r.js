const app = require("express");
const router = app.Router();

const authController = require("../controllers/auth.c");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/check", authController.checkToken);
router.post("/refresh", authController.refreshToken);

module.exports = router;

require("dotenv").config();
const express = require("express");
const exphbs = require("express-handlebars");
const app = express();
const cookieparser = require("cookie-parser");

const port = process.env.SHOP_PORT;

const authRouter = require("./routers/auth.r");
const mainRouter = require("./routers/main.r");

app.engine(
  "hbs",
  exphbs.engine({
    extname: "hbs",
    defaultLayout: "container.hbs",
    layoutsDir: __dirname + "/views/layouts",
    partialsDir: __dirname + "/views/components",
  }),
);
app.set("views", __dirname + "/views");
app.set("view engine", "hbs");

app.use(express.static(__dirname + "/public"));
app.use(cookieparser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("", authRouter);
app.use("", mainRouter);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode | 500;
  res.status(statusCode).send(err.message);
});

app.listen(port, () => console.log(`Shop server listening on port ${port}`));

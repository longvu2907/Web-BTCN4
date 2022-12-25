require("dotenv").config();
const express = require("express");
const exphbs = require("express-handlebars");
const app = express();

const port = process.env.SHOP_PORT;

// app.engine(
//   "hbs",
//   exphbs.engine({
//     extname: "hbs",
//     defaultLayout: "container.hbs",
//     layoutsDir: "views/_layouts",
//     partialsDir: "views/_layouts",
//   }),
// );
// app.set("view engine", "hbs");

// app.use(express.static(__dirname + "/public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((err, req, res, next) => {
  const statusCode = err.statusCode | 500;
  res.status(statusCode).send(err.message);
});

app.listen(port, () => console.log(`Shop server listening on port ${port}`));

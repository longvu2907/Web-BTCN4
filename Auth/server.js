require("dotenv").config();
const express = require("express");
const exphbs = require("express-handlebars");
const app = express();
const http = require("http");
const https = require("https");

const port = process.env.AUTH_PORT;
const credentials = {
  key: process.env.PRIVATE_KEY,
  cert: process.env.CERTIFICATE,
};

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

var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);
httpsServer.listen(port, () => console.log(`Listening on port ${port}`));

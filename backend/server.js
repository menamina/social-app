require("dotenv").config();
const express = require("express");
const server = express();
const port = process.env.PORT || 5555;
const routes = require("./router/routes");
const cors = require("cors");

server.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

server.use(express.json());
server.use(express.urlencoded({ extended: false }));

server.use("/uploads", express.static("uploads"));
server.use("/", routes);

function iferr(error) {
  if (error) {
    return console.log("big server whomp :(");
  }
  console.log("no server whomp!");
}
server.listen(port, iferr);

require("dotenv").config();

const express = require("express");
const server = express();
const port = process.env.PORT || 5555;

const routes = require("./router/routes");
const cors = require("cors");

const session = require("express-session");

server.use(express.json());
server.use(express.urlencoded({ extended: false }));

function iferr(error) {
  if (error) {
    return console.log("big server whomp :(");
  }
  console.log("no server whomp!");
}
server.listen(port, iferr);

const express = require("express");
const router = express.Router();
const axios = require("axios");
const HOST = "http://localhost:3001/registerUser";

var mysql = require("mysql");
var connection = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "password",
  database: "honey",
});

connection.connect();

router.get("/login/success", async (req, res, next) => {
  console.log(req.headers.cookie);

  console.log(req.headers.cookie.split("login=")[1]);

  res.setHeader("Cookie", req.headers.cookie);
  connection.query(
    `SELECT * FROM report_login WHERE cookie="${
      req.headers.cookie.split("login=")[1]
    }"`,
    function (error, emailResult, fields) {
      if (error) throw error;
      console.log(emailResult[0].email);
      connection.query(
        `SELECT * FROM user WHERE email="${emailResult[0].email}"`,
        function (error, user, fields) {
          if (error) throw error;
          console.log(user[0]);
          res.send(user[0]);
        }
      );
    }
  );

  console.log(res.getHeaders());

  /*
  res.send({
    name: req.query.name,
    years: req.query.years,
    email: req.query.email,
  });
  */
});

router.get("/login/error", (req, res, next) => {
  res.statusCode = 500;
  if (req.headers.cookie !== undefined) {
    res.setHeader("Cookie", req.headers.cookie);
  }
  console.log(res.getHeaders());
  res.sendStatus(500);
});

router.get("/registration/success", (req, res, next) => {
  res.statusCode = 200;
  if (req.headers.cookie !== undefined) {
    res.setHeader("Cookie", req.headers.cookie);
  }
  console.log(res.getHeaders());
  axios.default
    .get(`${HOST}?username=${req.query.email}`)
    .then(() => {
      res.sendStatus(200);
    })
    .catch((err) => res.send(err));
});

router.get("/registration/error", (req, res, next) => {
  res.statusCode = 500;
  if (req.headers.cookie !== undefined) {
    res.setHeader("Cookie", req.headers.cookie);
  }
  console.log(res.getHeaders());
  res.sendStatus(500);
});

module.exports = router;

var mysql = require("mysql");
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("config");
const router = express.Router();

var app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
var connection = mysql.createConnection({
  //properties...
  host: "localhost",
  user: "root",
  password: "",
  database: "todoapp",
  multipleStatements: true
});
/*connection.connect(err => {
  if (!err) {
    console.log("DataBase Connection Succeded");
  } else {
    console.log(
      "DataBase Connection Failed \n Error:" + JSON.stringify(err, undefined, 2)
    );
  }
});
app.listen(3000, () =>
  console.log("Express server is running at port Number:3000")
);*/

router.get("/", (req, res) => {
  connection.query("SELECT * FROM `users`", (err, rows, field) => {
    if (!err) {
      console.log(rows); //To Display On Console[This line is Not Required only to Display On the Console]
      res.send(rows);
    } else {
      console.log(err);
      //parse with your rows fields
    }
  });
});

router.post("/registration", async (req, res) => {
  const salt = await bcrypt.genSalt(10);
  let password = await bcrypt.hash(req.body.password, salt);
  let post = {
    name: req.body.name,
    email: req.body.email,
    password
  };

  //res.write('You inserted A Task"' + req.body.Task+'".\n');
  connection.query("INSERT INTO `users` SET ?", post, (err, rows, fields) => {
    if (!err) {
      console.log(rows); //To Display On Console[This line is Not Required only to Display On the Console]
      res.status(200).send(post);
    } else {
      if (err.code === "ER_DUP_ENTRY") {
        res.status(400).send({ type: "error", message: "Duplicate entry" });
      }
      console.log(err);
      //parse with your rows fields
    }
  });
});

router.post("/login", (req, res) => {
  var email = req.body.email;
  var password = req.body.password;
  connection.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    async function(error, results, fields) {
      if (error) {
        // console.log("error ocurred",error);
        res.send({
          code: 400,
          failed: "error ocurred"
        });
      } else {
        // console.log('The solution is: ', results);
        if (results.length > 0) {
          const validPassword = await bcrypt.compare(
            req.body.password,
            results[0].password
          );
          if (validPassword) {
            // res.send({
            // code: 200,
            //success: "login sucessfull"
            //});

            const token = jwt.sign(
              { userid: results[0].userid },
              config.get("jwtPrivateKey")
            );
            res.send(token);
          } else {
            res.send({
              code: 204,
              success: "Email and password does not match"
            });
          }
        } else {
          res.send({
            code: 204,
            success: "Email does not exits"
          });
        }
      }
    }
  );
});
module.exports = router;

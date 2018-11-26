var mysql = require("mysql");
const users = require("./users.js");
const express = require("express");
var app = express();
const config = require("config");
const bodyParser = require("body-parser");
const authm = require("./auth/authcontroller");
const cors = require("cors");

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/api/users", users);
var connection = mysql.createConnection({
  //properties...
  host: "localhost",
  user: "root",
  password: "",
  database: "todoapp",
  multipleStatements: true
});
connection.connect(err => {
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
);

if (!config.get("jwtPrivateKey")) {
  console.error("FATAL ERROR jwtPrivateKey not defined");
  process.exit(1);
}

//This Is To Get All Tasks
app.get("/api/tasks", (req, res) => {
  connection.query("SELECT * FROM `tasks`", (err, rows, field) => {
    if (!err) {
      console.log(rows); //To Display On Console[This line is Not Required only to Display On the Console]
      res.send(rows);
    } else {
      console.log(err);
      //parse with your rows fields
    }
  });
});

//This Is To Get A Specific Tasks
app.get("/api/tasks/:id", (req, res) => {
  connection.query(
    "SELECT * FROM `tasks` WHERE id=?",
    [req.params.id],
    (err, rows, field) => {
      if (!err) {
        console.log(rows); //To Display On Console[This line is Not Required only to Display On the Console]
        res.send(rows);
      } else {
        console.log(err);
        //parse with your rows fields
      }
    }
  );
});

//This Is To Delete A Specific Tasks
app.delete("/api/task/delete/:id", (req, res) => {
  connection.query(
    "DELETE FROM `tasks` WHERE id=?",
    [req.params.id],
    (err, rows, field) => {
      if (rows.affectedRows === 1) {
        console.log(rows); //To Display On Console[This line is Not Required only to Display On the Console]
        res.send("Deleted Successfully");
      } else {
        return res
          .status(404)
          .send({ type: "error", message: "Task not found!" });
        console.log(err);
        //parse with your rows fields
      }
    }
  );
});

//Posting Data[Inserting Data into the database]
app.post("/api/task/post", authm, (req, res) => {
  let title = req.body.title;
  let id = req.body.id;
  let created_at = new Date();
  let post = { id: req.body.id, title: req.body.title, created_at };
  console.log(id, title);
  //res.write('You inserted A Task"' + req.body.Task+'".\n');
  var len = Buffer.byteLength(title);
  if (len <= 20 && len >= 5) {
    connection.query("INSERT INTO `tasks` SET ?", post, (err, rows, fields) => {
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
  } else {
    res
      .status(400)
      .send({ type: "error", message: "task length is not suitable" });
  }
});

//Update Data[Updating Data into the database]
app.put("/api/task/update", (req, res) => {
  let title = { title: req.body.title };
  let id = { id: req.body.id };

  let updated_at = new Date();
  let x = { title: req.body.title, updated_at };
  //let update={Task:req.body.Task,Id:req.body.Id};
  console.log(title);
  connection.query(
    "UPDATE `tasks` SET ?  WHERE ? ",
    [x, id],
    (err, rows, fields) => {
      if (rows.affectedRows === 1) {
        console.log(rows); //To Display On Console[This line is Not Required only to Display On the Console]
        res.send("Updated Successfully");
      } else {
        return res
          .status(404)
          .send({ type: "error", message: "Task not found to update" });
        console.log(err);
        //parse with your rows fields
      }
    }
  );
});
//connection.end();

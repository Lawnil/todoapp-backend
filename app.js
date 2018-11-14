const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors());
app.use(express.json());
const tasks = require("./index.js");

function errorHandler(err, res, req) {
  if (err.name === "CastError")
    res.status(404).send({ type: "error", message: "Task not found" });
  else if (err.status() === 400)
    res.send({ type: "error", message: "Bad Request" });
  else {
    res.status(500).send({ type: "error", message: "Internal Error" });
  }
}

app.get("/", (req, res) => {
  res.send("To Do Task App");
});

app.get("/api/tasks", (req, res) => {
  tasks.find({}).exec(function(err, task) {
    if (err) {
    } else {
      res.status(200).json(task);
    }
  });
});

app.get("/api/tasks/:id", (req, res) => {
  tasks.findById(req.params.id).exec(function(err, task) {
    if (err) {
      if (err.name === "CastError")
        return res
          .status(404)
          .send({ type: "error", message: "Task not found" });
      else {
        res.status(500).send({ type: "error", message: "Internal" });
      }
    } else {
      res.status(200).json(task);
    }
  });
});

app.post("/api/tasks", (req, res) => {
  tasks.create(req.body).then(function(task) {
    res.send(task);
  });
});

app.put("/api/tasks/:id", (req, res) => {
  tasks
    .findByIdAndUpdate({ _id: req.params.id }, req.body)
    .exec(function(err, task) {
      if (err) {
        return res.status(404).send({
          type: "error",
          message: "Cannot find the task to update"
        });
      }
      tasks.findOne({ _id: req.params.id }).then(function(task) {
        res.send(task);
      });
    });
});

app.delete("/api/tasks/:id", (req, res) => {
  tasks.findByIdAndRemove({ _id: req.params.id }).exec(function(err, task) {
    if (err) {
      return res.status(404).send({
        type: "error",
        message: "Cannot find the given task to delete"
      });
    }
    res.send("Data has been deleted..");
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));

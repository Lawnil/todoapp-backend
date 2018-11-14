const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors());
app.use(express.json());
const tasks = require("./index.js");
const mongoose = require("mongoose");
const Joi = require("joi");

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

app.get("/api/tasks", async (req, res) => {
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
  const { error } = validateTask(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  tasks.create(req.body).then(function(task) {
    res.send(task);
  });
});

app.put("/api/tasks/:id", (req, res) => {
  tasks
    .findByIdAndUpdate({ _id: req.params.id }, req.body)
    .exec(function(err, task) {
      if (!task)
        return res
          .status(404)
          .send({ type: "error", message: "Task could not be found" });
      const { error } = validateTask(req.body);
      if (error) return res.status(400).send(error.details[0].message);
      tasks.findOne({ _id: req.params.id }).then(function(task) {
        res.send(task);
      });
    });
});

app.delete("/api/tasks/:id", (req, res) => {
  tasks.findByIdAndRemove({ _id: req.params.id }).exec(function(err, task) {
    if (!task)
      return res
        .status(404)
        .send({ type: "error", message: "Task could not be found" });
    res
      .status(200)
      .send({ type: "success", message: "Data has been deleted.." });
  });
});

function validateTask(task) {
  const schema = {
    taskstring: Joi.string()
      .min(5)
      .required()
  };
  return Joi.validate(task, schema);
}

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Listening on port ${port}...`));

const express = require("express");
const app = express();
app.use(express.json());
const tasks = require("./index.js");

app.get("/", (req, res) => {
  res.send("To Do Task App");
});

app.get("/api/tasks", (req, res) => {
  tasks.find({}).exec(function(err, task) {
    if (err) {
      console.log("Error retrieving videos");
    } else {
      res.json(task);
    }
  });
});

app.get("/api/tasks/:id", (req, res) => {
  tasks.findById(req.params.id).exec(function(err, task) {
    if (err) {
      console.log("Error retrieving videos");
    } else {
      res.json(task);
    }
  });
});

app.post("/api/tasks", (req, res) => {
  tasks.create(req.body).then(function(task) {
    res.send(task);
  });
});

app.put("/api/tasks/:id", (req, res) => {
  /* const task = tasks.find(c => c.id === parseInt(req.params.id));
  if (!task)
    return res.status(404).send("The course with the given ID was not found");
*/
  tasks.findByIdAndUpdate({ _id: req.params.id }, req.body).then(function() {
    tasks.findOne({ _id: req.params.id }).then(function(task) {
      res.send(task);
    });
  });
});

app.delete("/api/tasks/:id", (req, res) => {
  /*const task = tasks.find(c => c.id === parseInt(req.params.id));
  if (!task)
    return res.status(404).send("The course with the given ID was not found");
*/
  tasks.findByIdAndRemove({ _id: req.params.id }).then(function(task) {
    res.send("Data has been deleted..");
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));

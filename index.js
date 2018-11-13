const mongoose = require("mongoose");
mongoose
  .connect("mongodb://localhost/tasksdatabase")
  .then(() => console.log("Connected to task database successfully"))
  .catch(err => console.error("Connection Failed...", err));

mongoose.Promise = global.Promise;
const taskSchema = new mongoose.Schema({
  taskstring: String
});

const Task = mongoose.model("Task", taskSchema);

/*async function createTask() {
  const task = new Task({
    taskstring: "Creating this app"
  });

  const result = await task.save();
  console.log(result);
}

createTask();*/
module.exports = Task;

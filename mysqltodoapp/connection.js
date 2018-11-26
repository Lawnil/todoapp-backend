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
module.exports = connection;

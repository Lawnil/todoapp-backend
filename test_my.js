var mysql=require('mysql');
const express=require('express');
var app=express();
const bodyParser=require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
var connection=mysql.createConnection({
//properties...
host: 'localhost',
user: 'root',
password: '',
database: 'app',
multipleStatements:true
});
connection.connect((err)=>{
if(!err){
	console.log('DataBase Connection Succeded');
	}
	else {
		   console.log('DataBase Connection Failed \n Error:'+JSON.stringify(err,undefined,2));
		 }
	});
app.listen(3000,()=>console.log('Express server is running at port Number:3000'));
//This Is To Get All Tasks	
app.get('/Task',(req,res)=>{
connection.query('SELECT * FROM `todo-app`',(err,rows,field)=>{
if(!err){
	console.log(rows);//To Display On Console[This line is Not Required only to Display On the Console]
	res.send(rows);
	}
else{
	console.log(err);
	//parse with your rows fields
	}
})
});


//This Is To Get A Specific Tasks	
app.get('/Task/:id',(req,res)=>{
	connection.query('SELECT * FROM `todo-app` WHERE id=?',[req.params.id],(err,rows,field)=>{
if(!err){
	console.log(rows);//To Display On Console[This line is Not Required only to Display On the Console]
	res.send(rows);
	}
else{
	console.log(err);
	//parse with your rows fields
	}
})
});

//This Is To Delete A Specific Tasks	
app.delete('/Task/:id',(req,res)=>{
connection.query('DELETE FROM `todo-app` WHERE id=?',[req.params.id],(err,rows,field)=>{
if(!err){
	console.log(rows);//To Display On Console[This line is Not Required only to Display On the Console]
	res.send('Deleted Successfully');
	}
else{
	console.log(err);
	//parse with your rows fields
	}
})
});

//Posting Data[Inserting Data into the database]
app.post('/Task/post',(req,res)=>{
	let Task=req.body.Task;
	let Id=req.body.Id;
	let Created_At = new Date();
	let post={Id:req.body.Id,Task:req.body.Task,Created_At};
console.log(Id,Task);
//res.write('You inserted A Task"' + req.body.Task+'".\n');                                              
connection.query("INSERT INTO `todo-app` SET ?",post,(err,rows,fields)=>{
if(!err){
	console.log(rows);//To Display On Console[This line is Not Required only to Display On the Console]
	res.send('Inserted Successfully');
	}
else{
	console.log(err);
	//parse with your rows fields
	}
})
});

//Update Data[Updating Data into the database]
app.put('/Task/update',(req,res)=>{
	let Task={Task:req.body.Task};
	let Id={Id:req.body.Id};
	let Updated_At =new Date();
	let update={Task:req.body.Task,Updated_At};
console.log(Task);                                              
connection.query("UPDATE `todo-app` SET ?  WHERE ? ",[update,Id],(err,rows,fields)=>{
if(!err){
	console.log(rows);//To Display On Console[This line is Not Required only to Display On the Console]
	res.send('Updated Successfully');
	}
else{
	console.log(err);
	//parse with your rows fields
	}
})
});
//connection.end();
const express = require('express');
const app = express();
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors')

var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'MakeDecision'
});


connection.connect(function (err) {
  if (err)
    console.error("Error occurred in database connection, please make sure DB server is running...");
  else
    console.log(`You are now connected with mysql database...`)
})

app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));
app.use(cors());

var server = app.listen(3000, "127.0.0.1", function () {
  var host = server.address().address
  var port = server.address().port
  console.log("Example app listening at http://%s:%s", host, port)
});

app.get('/users', function (req, res) {
  connection.query('select * from Users', function (error, results, fields) {
    if (error)
      console.error("Some error occurred");
    
    res.end(JSON.stringify(results));
  });
});

app.get('/users/:id', function (req, res) {
  connection.query('select * from Users where Id=?', [req.params.id], function (error, results, fields) {
    if (error) 
      console.log("ERRORRRR : "+error)
    res.end(JSON.stringify(results));
  });
});

// Register user
app.post('/register', function (req, res) {
  let user = req.body;
  console.log(user);
  connection.query(`insert into Users values(NULL,${user.role_id},'${user.name}',${user.active},now(),'${user.email}')`, function (error, results, fields) {
    if (error) {
      console.error(`Error occurred ` + error)
      res.sendStatus(400).end("Duplicate entry")
    }
    else 
      res.sendStatus(200).end();    
  });
});


app.put('/customer', function (req, res) {
  connection.query('UPDATE `customer` SET `Name`=?,`Address`=?,`Country`=?,`Phone`=? where `Id`=?', [req.body.Name, req.body.Address, req.body.Country, req.body.Phone, req.body.Id], function (error, results, fields) {
    if (error) throw error;
    res.end(JSON.stringify(results));
  });
});


app.delete('/customer', function (req, res) {
  console.log(req.body);
  connection.query('DELETE FROM `customer` WHERE `Id`=?', [req.body.Id], function (error, results, fields) {
    if (error) throw error;
    res.end('Record has been deleted!');
  });
});

app.get('*', (req, res) => {
  console.log("Unknown page request just made")
  res.sendStatus(404).end("Page not found!");
})


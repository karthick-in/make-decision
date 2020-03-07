const express = require('express');
const app = express();
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const cryptojs = require('crypto-js');

const tokenSecretKey = "zzkeyzER";
const decryptSecretKey = "uierQsg";

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
      console.log("ERRORRRR : " + error)
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

// Login user
app.post('/login', function (req, res) {
  let user = req.body;
  user.password = decrypt(user.password);
  connection.query(`SELECT * FROM Users WHERE email='${user.email}' and password='${user.password}'`, function (error, results, fields) {
    if (error) {
      console.error(`Error occurred ` + error)
      res.status(401).send();
    }
    else if (!(Object.keys(results).length > 0)) {
      res.status(401).send();
    }
    else {
      user = results[0];
      let payload = { subject: user.id }
      let token = jwt.sign(payload, tokenSecretKey)
      res.status(200).send({ token });
    }
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

app.get('/verifytoken', verifyToken, (req, res) => {
  res.status(200).end();
});

app.get('*', (req, res) => {
  console.log("Unknown page request just made")
  res.sendStatus(404).end("Page not found!");
})

function decrypt(encryptedText) {
  return cryptojs.AES.decrypt(encryptedText, decryptSecretKey.trim()).toString(cryptojs.enc.Utf8);
}

function verifyToken(req, res, next) {
  if(!req.headers.authorization) {
    return res.status(401).send('Unauthorized request')
  }
  let token = req.headers.authorization.split(' ')[1]
  if(token === 'null') {
    return res.status(401).send('Unauthorized request')    
  }
  try {
    var payload = jwt.verify(token, tokenSecretKey)    
  } catch (error) {
    return res.status(401).end();
  }
  
  if(!payload) {
    return res.status(401).send('Unauthorized request')    
  }
  req.userId = payload.subject
  next()
}
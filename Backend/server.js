const express = require('express');
const app = express();
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const cryptojs = require('crypto-js');

const tokenSecretKey = "zzkeyzER";
const decryptSecretKey = "uierQsg";
const portNumber = 3000;

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

var server = app.listen(portNumber, "127.0.0.1", function () {
  var host = server.address().address
  var port = server.address().port
  console.log("Example app listening at http://%s:%s", host, port)
}).on('error', function (err) {
  if (err.errno == 'EADDRINUSE') {
    console.error(`Port ${portNumber} busy`);
  }
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
      res.end();
  });
});

app.post('/insertquestion', verifyToken, (req, res) => {
  let question = req.body;
  question.from += "UTC";
  question.to += "UTC";
  connection.query(`insert into Question values(NULL,'${question.question}','${getMysqlDateFormat(new Date(question.from))}','${getMysqlDateFormat(new Date(question.to))}',${question.answer_type},now())`, function (error, results, fields) {
    if (error) {
      console.error(`Error occurred ` + error)
      res.sendStatus(400).end("Error")
    }
    else
      res.sendStatus(200).end();
  });
});

function getMysqlDateFormat(date) {
  return date.toISOString().slice(0, 19).replace('T', ' ');
}

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
      user = customizeResult(user, token);
      res.status(200).send({ user });
    }
  });
});

function customizeResult(values, token) {
  delete values['password'];
  values['token'] = token;
  return values;
}


app.put('/customer', function (req, res) {
  connection.query('UPDATE `customer` SET `Name`=?,`Address`=?,`Country`=?,`Phone`=? where `Id`=?', [req.body.Name, req.body.Address, req.body.Country, req.body.Phone, req.body.Id], function (error, results, fields) {
    if (error) throw error;
    res.end(JSON.stringify(results));
  });
});


app.post('/deletequestion', verifyToken, (req, res) => {
  let question = req.body;
  deleteOptionsIfAny(question);
  connection.query(`DELETE FROM Question WHERE id=${question.id}`, function (error, results, fields) {
    if (error) {
      console.error(`Error occurred ` + error)
      res.sendStatus(400).end("Error")
    }
    else
      res.status(200).end();
  });
});

function deleteOptionsIfAny(question) {

  connection.query(`DELETE FROM Option WHERE question_id=${question.id}`, function (error, results, fields) {
    if (error) {
      console.error(`Error occurred ` + error)
      res.sendStatus(400).end("Error")
    } else {
      return;
    }
  });

}

app.get('/verifytoken', verifyToken, (req, res) => {
  res.status(200).end();
});

//Get all questions...
app.get('/getquestions', verifyToken, (req, res) => {
  connection.query('select * from Question', (error, results, fields) => {
    if (error) {
      console.error("Some error occurred");
      res.status(401).send();
    } else
      res.end(JSON.stringify(results));
  });
});

app.get('/answertype', verifyToken, (req, res) => {
  connection.query('select * from Answer_type', (error, results, fields) => {
    if (error) {
      console.error("Some error occurred");
      res.status(401).send();
    } else
      res.end(JSON.stringify(results));
  });
});

app.get('*', (req, res) => {
  console.log("Unknown page request just made")
  res.sendStatus(404).end("Page not found!");
})

function decrypt(encryptedText) {
  return cryptojs.AES.decrypt(encryptedText, decryptSecretKey.trim()).toString(cryptojs.enc.Utf8);
}

function verifyToken(req, res, next) {
  if (!req.headers.authorization) {
    return res.status(401).send('Unauthorized request')
  }
  let token = req.headers.authorization.split(' ')[1]
  if (token === 'null') {
    return res.status(401).send('Unauthorized request')
  }
  try {
    var payload = jwt.verify(token, tokenSecretKey)
  } catch (error) {
    return res.status(401).end();
  }

  if (!payload) {
    return res.status(401).send('Unauthorized request')
  }
  req.userId = payload.subject
  next()
}
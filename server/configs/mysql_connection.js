/*
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "opatysh"
});

con.connect((err) => {
  if (err) throw err;
  console.log("Connected!");
  });
});
*/

var mysql = require('mysql');

module.exports =  connection = mysql.createConnection({
  host: 'localhost',
  database: 'oparysh',
  user: 'nodejsserver',
  password: '12345'
});

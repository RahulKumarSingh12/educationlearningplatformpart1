var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "username",
  password: "password",
  database: 'my_database',
});


con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});

module.exports.con=con;
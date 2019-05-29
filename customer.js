var sql = require('mysql');
var inq = require('inquirer');

var connection = sql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "25064c001023818v",
  database: "bamazon_db"
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("succesful connection");
  afterConnection();
});

function afterConnection() {
//    inq.prompt([

//         {
//             type: "input",
//             name: "customerIDChoice",
//             message: "please type the id of the product you'd like to buy."
//         }


//     ]).then(function (query) {
  connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;
    console.log(res);
    connection.end();
  });
}
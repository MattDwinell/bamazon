var sql = require('mysql');
var inq = require('inquirer');
var productsArray = [];
var productChoice;
var connection = sql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "25064c001023818v",
    database: "bamazon_db"
});

connectionStart();

function connectionStart(){
connection.connect(function (err) {
    if (err) throw err;
    console.log("succesful connection");
    customerItemDisplay();
});
}

function customerItemDisplay() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        productsArray = res;
        console.log('------------------  welcome to.... bamazon... look at these wonderful, totally corporeal products  ------------------')
        for (let i = 0; i < productsArray.length; i++) {
            console.log('id: ' + productsArray[i].id, ' | name: ' + productsArray[i].product_name, ' | price: $' + productsArray[i].price);
            console.log('______________________________________');
        }
       
        customerItemSelection();
    });
}

function customerItemSelection() {
    inq.prompt([

        {
            type: "input",
            name: "customerIDChoice",
            message: "please type the id of the product you'd like to buy."
        },
        {
            type: "input",
            name: "customerQuantityChoice",
            message: "how many would you like to buy?"
        }


    ]).then(function (query) {
        var customerIDChoice = parseFloat(query.customerIDChoice);
        var customerQuantityChoice = parseFloat(query.customerQuantityChoice);
        for (let i=0; i<productsArray.length; i ++){
            if (productsArray[i].id == customerIDChoice){
                productChoice = productsArray[i];
            }
        }
        if (productChoice){
            console.log('youve chosen to buy ' + customerQuantityChoice + ' ' + productChoice.product_name + '(s)');
            if (parseFloat(productChoice.stock_quantity) >= customerQuantityChoice){
                console.log ('you have purchased ' + customerQuantityChoice + ' ' + productChoice.product_name + '(s) ' + 'for a total of $' + productChoice.price * customerQuantityChoice);
                productChoice.stock_quantity -= customerQuantityChoice;
                updateProduct();

            } else {
                console.log("sorry, we do not have that many " + productChoice.product_name + ' in stock. Try again.');
                customerItemDisplay();
            }
        } else {
            console.log('you have selected an invalid ID. please try again');
           customerItemDisplay();
        }
    })
}
function updateProduct() {
    console.log("Updating Database...\n");
    var query = connection.query(
      "UPDATE products SET ? WHERE ?",
      [
        {
          stock_quantity: productChoice.stock_quantity
        },
        {
          id: productChoice.id
        }
      ],
      function(err, res) {
          if (err) throw err;
        console.log("thank you for using bamazon. the connection will now terminate.");
        connection.end();
     
      }
    );
  
    // logs the actual query being run
    console.log(query.sql);
  }
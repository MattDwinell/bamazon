var sql = require('mysql');
var inq = require('inquirer');
var productsArray = [];
var connection = sql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "25064c001023818v",
    database: "bamazon_db"
});

connectionStart();

function connectionStart() {
    connection.connect(function (err) {
        if (err) throw err;
        console.log("succesful connection");
        managerChoices();
    });
}
function managerChoices() {
    inq.prompt([{
        type: "list", name: "managerChoice", message: 'please choose an option', choices: ['view products for sale', 'view low inventory', 'add more inventory', 'add a new product']
    }]).then(function (query) {
        if (query.managerChoice == 'view products for sale')  {
            connection.query("SELECT * FROM products", function (err, res) {
                if (err) throw err;
                productsArray = res;
                console.clear();
                console.log('------------------  stock overview for bamazon database, manager edition ------------------')
                for (let i = 0; i < productsArray.length; i++) {
                    console.log('id: ' + productsArray[i].id, ' | name: ' + productsArray[i].product_name, ' | price: $' + productsArray[i].price, ' | department: ' + productsArray[i].department + ' | stock: ' + productsArray[i].stock_quantity);
                    console.log('_____________________________________________________________');
                }

                managerChoices();
            });
        } else if (query.managerChoice == 'view low inventory') {
            console.log('searching for products with less than ten units remaining...');
            console.log('------------------  Low inventory ------------------  ')
            connection.query("SELECT * FROM products WHERE stock_quantity < 10", function (err, res) {
                if (err) throw err;
                console.clear();
                for (let i=0; i<res.length; i ++){
                    console.log('id: ' + res[i].id, ' | name: ' + res[i].product_name, ' | price: $' + res[i].price, ' | department: ' + res[i].department + ' | stock remaining: ' + res[i].stock_quantity);
                    console.log('_______________________________________________________________');
                }
                managerChoices();
            })

        }
    })
}
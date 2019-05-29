var sql = require('mysql');
var inq = require('inquirer');
var productsArray = [];
var managerProduct;
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
        managerChoices();
    });
}
function managerChoices() {
    inq.prompt([{
        type: "list", name: "managerChoice", message: 'please choose an option', choices: ['view products for sale', 'view low inventory', 'add more inventory', 'add a new product', 'quit']
    }]).then(function (query) {
        if (query.managerChoice == 'view products for sale') {
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
                for (let i = 0; i < res.length; i++) {
                    console.log('id: ' + res[i].id, ' | name: ' + res[i].product_name, ' | price: $' + res[i].price, ' | department: ' + res[i].department + ' | stock remaining: ' + res[i].stock_quantity);
                    console.log('_______________________________________________________________');
                }
                managerChoices();
            })

        } else if (query.managerChoice == 'add more inventory') {
            inq.prompt([{
                type: 'input', name: 'managerIDChoice', message: 'type the id of the product you would like to add more of'
            }, {
                type: 'input', name: 'managerQuantityChoice', message: 'how many units are being added to the inventory?'
            }]).then(function (ans) {
                var managerIDChoice = parseFloat(ans.managerIDChoice);
                var managerQuantityChoice = parseFloat(ans.managerQuantityChoice);
                connection.query("SELECT * FROM products", function (err, res) {
                    if (err) throw err;
                    productsArray = res;

                    
                        for (let i = 0; i < productsArray.length; i++) {
                            if (productsArray[i].id == managerIDChoice) {
                                managerProduct = productsArray[i];
                            }
                        }
                        if (managerProduct) {

                        console.log('adding ' + managerQuantityChoice + ' units to ' + managerProduct.product_name);
                        managerProduct.stock_quantity += managerQuantityChoice;
                        updateProductQuantity();



                    } else {
                        console.log('invalid id entered, please refer to inventory to look at all ids');
                        managerChoices();
                    }


                })
            })
        } else if (query.managerChoice == 'add a new product'){
            inq.prompt([{
                type:'input', name: 'newProduct', message: 'input product name: '
            }, {type:'input', name:'productDepartment', message: 'input product department: ' }, {
                type:'input', name: 'initialStockQuantity', message: 'input initial stock of new product:'}, {type:'input', name:'initialPrice', message: 'input Initial price of item:'}
        ]).then(function(ans){
            parseFloat(ans.initialStockQuantity, ans.initialPrice);
            if (ans.newProduct && ans.productDepartment &&typeof  ans.initialStockQuantity == 'integer' && typeof ans.initialPrice == 'number'){
                console.log("adding " + ans.newProduct + " to the database.");
                connection.query(
                    "INSERT INTO products SET ?",
                    {
                      product_name: ans.newProduct,
                      department: ans.productDepartment,
                     stock_quantity: ans.initialStockQuantity,
                     price: ans.initialPrice
                    },
                    function(err, res) {
                        if(err) throw err;
                      console.log('product added! Returning to the main menu.');
                      managerChoices();
                     
                    }
                  );
                
            } else {
                console.log("please fill in all input fields properly when creating a new product. returning to the main menu.");
                managerChoices();
            }
        })

        } else if  (query.managerChoice == 'quit'){
            console.log("terminating application. goodbye.");
            connection.end();
        }
    })
}
function updateProductQuantity() {
    console.clear();
    console.log("Updating Database...\n");
    var query = connection.query(
        "UPDATE products SET ? WHERE ?",
        [
            {
                stock_quantity: managerProduct.stock_quantity
            },
            {
                id: managerProduct.id
            }
        ],
        function (err, res) {
            if (err) throw err;
            console.log("Product has been succesfully updated. there are now " + managerProduct.stock_quantity + " units of " + managerProduct.product_name + "(s) in stock. Returning to Main Menu.");
            managerChoices();

        }
    );

}
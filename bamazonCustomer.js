// NPM Packages ==============================
var mySQL = require("mysql");
var inquirer = require("inquirer");

// Connection Object ===========================================================
var connection = mySQL.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "SQLserver2017!",
  database: "bamazondb"
});


connection.connect(function(err){
  if (err) throw err;
  // CONSOLE LOG TO CONFIRM WE ARE CONNECTED TO MySQL ==========================
  console.log("Connected as id: " + connection.threadId);
  // CALL THE "inventory" FUNCTION TO DISPLAYING AVAILABLE INVENTORY ===========
  inventory();
});

// 1. Running this application will first display all of the items available for sale. Include the ids, names, and prices of products for sale.
function inventory(){
  // SELECT ALL ITEMS IN "products table" FROM THE "bamazon" DATABASE ==========
  var queryStr = "SELECT * FROM products";

  connection.query(queryStr, function(err, data){
    if (err){
      console.log(err);
    }
    else{
      for (var i = 0;  i < data.length; i++){

        console.log("=======================================")
        console.log("Item ID : " + data[i].item_id);
        console.log("Product: " + data[i].product_name);
        console.log("Department: " + data[i].department_name);
        console.log("Price: " + "$" + data[i].price);
        console.log("Stock Quantity: " + data[i].stock_quantity);
        console.log("****************************************");
      }
    }   
    purchase();
  });
};


function purchase(){
  connection.query("SELECT * FROM products", function (err, data){
    if (err) throw err;

    inquirer.prompt([
      // 2. The first should ask them the ID of the product they would like to buy.
      {
        name: 'item_id',
        type: 'input',
        message: 'Select the "Item ID" of the product you wish to buy.'
      },
  
      // 3. The second message should ask how many units of the product they would like to buy.
      {
        name: 'quantity',
        type: 'input',
        message: 'How many units of this product would you like to buy?'
      }
  
    ]).then(function (answer){
  
      var chosenProduct;
  
      for (var i = 0; i < data.length; i += 1){
        if (data[i].item_id === parseInt(answer.item_id)){
          chosenProduct = data[i];
        }
      };

      if(chosenProduct.stock_quantity < parseInt(answer.quantity)){
        console.log("========================================");
        console.log("Sorry, Insuficient Quantity.");
        console.log("========================================");

        // YOU CAN EITHER END THE CONNECTION OR RUN THE "inventory function" again to select a different item or amount.
        connection.end();
        // inventory();
      }
      else{
        // UPDATE STOCK ==============================================================
        var quantityUpdate = chosenProduct.stock_quantity - parseInt(answer.quantity);
  
        connection.query(
          "UPDATE products set ? WHERE ?", [
            {
              item_id: chosenProduct.item_id              
            },
            {
              stock_quantity: quantityUpdate
            }
          ],
          function(err){
            if (err){
              console.log(err);
            }
            else{
              var totalPrice = chosenProduct.price * parseInt(answer.quantity);

              console.log("=================================")
              console.log("Your purchase total is: " + totalPrice);
              console.log("Current stock is: "  + quantityUpdate + " units.");

              connection.end();
            }
          }
        )
      }
    });
  });
};
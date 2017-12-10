// NPM Packages ==============================
var mySQL = require("mysql");
var inquirer = require("inquirer");

// Connection Object =========================
var connection = mySQL.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "SQLserver2017!",
  database: "bamazondb"
});


connection.connect(function(err){
 console.log("Connected as id: " + connection.threadId);
});


// 1. Running this application will first display all of the items available for sale. Include the ids, names, and prices of products for sale.
//==============================================================================
function inventory(){
  var queryStr = "SELECT * FROM products";

  connection.query(queryStr, function(err, data){
    if (err) throw err;
  //  console.log(data);

    for (var i = 0;  i < data.length; i++){
      console.log("=======================================")
      console.log("Item ID : " + data[i].item_id);
      console.log("Product: " + data[i].product_name);
      console.log("Department: " + data[i].department_name);
      console.log("Price: " + "$" + data[i].price);
    }

    console.log("****************************************");
    purchase();
  })
}
inventory();



function purchase(){

  inquirer.prompt([
    // 2. The first should ask them the ID of the product they would like to buy.
    //==============================================================================
    {
      name: 'item_id',
      type: 'input',
      message: 'Select the "Item ID" of the product you wish to buy.'
    },
    // 3. The second message should ask how many units of the product they would like to buy.
    //==============================================================================
    {
      name: 'quantity',
      type: 'input',
      message: 'How many units of this product would you like to buy?'
    }

  ]).then(function (input){
    var item = input.item_id;
    var quantity = input.quantity;

    var queryStr = "SELECT * FROM products WHERE ?";

    connection.query(queryStr, {item_id: item}, function(err, data){
      if (err) throw err;

      if (data.length === 0){
        console.log("invalid input. Please select an item ID:");
        inventory();
      }
      else {
        var productData = data [0];

        if (quantity <= productData.stock_quantity){
          console.log("Order being processed!");

          var updateQueryStr = "Stock Update= " + (productData.stock_quantity - quantity) + 'WHERE item_id= ' + item;
          console.log('updateQueryStr= ' + updateQueryStr);
        }
      }
    })
  })
}






// 4.  Once the customer has placed the order, your application should check if your store has enough of the product to meet the customer's request.
//If not, the app should log a phrase like `Insufficient quantity!`, and then prevent the order from going through.
//==============================================================================



// 5.  However, if your store _does_ have enough of the product, you should fulfill the customer's order.
   // This means updating the SQL database to reflect the remaining quantity.
   // Once the update goes through, show the customer the total cost of their purchase.
//==============================================================================




































/*
* If this activity took you between 8-10 hours, then you've put enough time into this assignment. Feel free to stop here -- unless you want to take on the next challenge.

- - -

### Challenge #2: Manager View (Next Level)

* Create a new Node application called `bamazonManager.js`. Running this application will:

  * List a set of menu options:

    * View Products for Sale

    * View Low Inventory

    * Add to Inventory

    * Add New Product

  * If a manager selects `View Products for Sale`, the app should list every available item: the item IDs, names, prices, and quantities.

  * If a manager selects `View Low Inventory`, then it should list all items with an inventory count lower than five.

  * If a manager selects `Add to Inventory`, your app should display a prompt that will let the manager "add more" of any item currently in the store.

  * If a manager selects `Add New Product`, it should allow the manager to add a completely new product to the store.

- - -

* If you finished Challenge #2 and put in all the hours you were willing to spend on this activity, then rest easy! Otherwise continue to the next and final challenge.

- - -

### Challenge #3: Supervisor View (Final Level)

1. Create a new MySQL table called `departments`. Your table should include the following columns:

   * department_id

   * department_name

   * over_head_costs (A dummy number you set for each department)

2. Modify the products table so that there's a product_sales column and modify the `bamazonCustomer.js` app so that this value is updated with each individual products total revenue from each sale.

3. Modify your `bamazonCustomer.js` app so that when a customer purchases anything from the store, the price of the product multiplied by the quantity purchased is added to the product's product_sales column.

   * Make sure your app still updates the inventory listed in the `products` column.

4. Create another Node app called `bamazonSupervisor.js`. Running this application will list a set of menu options:

   * View Product Sales by Department

   * Create New Department

5. When a supervisor selects `View Product Sales by Department`, the app should display a summarized table in their terminal/bash window. Use the table below as a guide.

| department_id | department_name | over_head_costs | product_sales | total_profit |
| ------------- | --------------- | --------------- | ------------- | ------------ |
| 01            | Electronics     | 10000           | 20000         | 10000        |
| 02            | Clothing        | 60000           | 100000        | 40000        |

6. The `total_profit` column should be calculated on the fly using the difference between `over_head_costs` and `product_sales`. `total_profit` should not be stored in any database. You should use a custom alias.

7. If you can't get the table to display properly after a few hours, then feel free to go back and just add `total_profit` to the `departments` table.

   * Hint: You may need to look into aliases in MySQL.

   * Hint: You may need to look into GROUP BYs.

   * Hint: You may need to look into JOINS.

   * **HINT**: There may be an NPM package that can log the table to the console. What's is it? Good question :)
*/

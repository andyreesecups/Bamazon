var mysql = require("mysql");
var inquirer = require("inquirer");
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "",
    database: "Bamazon"
});

connection.connect(function(err) {
    if (err) throw err;
});

// function which prompts the user for what action they should take
var start = function() {
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            console.log("ID " + res[i].id + " || Product Name: " + res[i].product_name + " || Department: " + res[i].department_name + " || Price: " + res[i].price + " || Quantity: " + res[i].quantity);
        }
        inquirer.prompt([{
            name: "item",
            type: "input",
            message: "What's the ID that you're interested in?",
        }, {
            name: "units",
            type: "input",
            message: "How many units do you want to purchase?"
        }]).then(function(answer) {

            connection.query("SELECT product_name FROM products WHERE ?", { id: answer.item }, function(err, res) {
                console.log("You want to purchase " + res[0].product_name + ".");
                console.log("You want" + " " + answer.units + " " + res[0].product_name +".");

                connection.query("SELECT quantity FROM products WHERE ?", { id: answer.item }, function(err, res) {
                    var amount = parseInt(res[0].quantity) - parseInt(answer.units);
                    // console.log(parseInt(amount));

                    if (parseInt(amount) > 0) {
                        connection.query("UPDATE products SET quantity = ? WHERE ?", [parseInt(amount), { id: answer.item }], function(err, res) {
                            console.log(amount + " left!");
                        })//end of changing stock quantities
                    } else {
                        console.log("Insufficent Amount you schmuck. Get something else.");
                    }//end of else


                })

            })
        })
    })
};



start();

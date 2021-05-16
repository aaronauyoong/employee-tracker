// Dependencies
const inquirer = require("inquirer");
const mysql = require("mysql");

const connection = mysql.createConnection({
	host: "localhost",
	port: 3306,

	// Your username
	user: "root",
	// Be sure to update with your own MySQL password!
	password: "",
	database: "employee_DB",
});

connection.connect((err) => {
	if (err) throw err;
    // Function to initiate search/app
	runSearch();
});

// Inquirer Questions

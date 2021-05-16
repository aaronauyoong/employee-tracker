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

// Functions for search/view
function runSearch();

function employeeSearch();

function budgetView();

function viewEmployeesByManager();

// Functions for adding
function addEmployee();

function departmentSearch();

function addDepartment();

// Functions for updating
function updateEmployee();

function updateEmployeeManager();

// Function for deleting
function deleteDepartment();

function deleteRoles();

function deleteEmployee();
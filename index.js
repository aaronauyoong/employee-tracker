// Dependencies
const inquirer = require("inquirer");
const mysql = require("mysql");

const connection = mysql.createConnection({
	host: "localhost",
	port: 3306,

	// Your username
	user: "root",
	// Be sure to update with your own MySQL password!
	password: "yourRootPassword",
	database: "employee_DB",
});

connection.connect((err) => {
	if (err) throw err;
    // Function to initiate search/app
	runSearch();
});

// Inquirer Questions

const operations = {
    // Search Data
    "Search For An Employee": employeeSearch,
    "Search For Department": departmentSearch,
    // View Data
    "View All Employees": viewAllEmployees,
    "View All Employees By Department": viewEmployeesByDepartment,
    "View All Employees By Manager": viewEmployeesByManager,
    "View Total Utilized Budget Of A Department": departmentBudgetView,
     // Add Data
    "Add Employee": addEmployee,
    "Add Department": addDepartment,
    "Add Role": addRole,
    // Update Data
    "Update Employee Role": updateEmployee,
    "Update Employee Manager": updateEmployeeManager,
    // Delete Data
    "Remove Employee": removeEmployee,
    "Remove Role": removeRole,
    "Remove Department": removeDepartment
}

// First function upon app initialisation
const runSearch = () => {
    inquirer
    .prompt({
        name: "action",
        type: "list",
        message: "Welcome to the Employee Tracker application. What would you like to do today?",
        choices: Object.keys(operations),
        choices: [
            "Search For An Employee",
            "Search For Department",
            "View All Employees",
            "View All Employees By Department",
            "View All Employees By Manager",
            "View Total Utilized Budget Of A Department",
            "Add Employee",
            "Add Department",
            "Add Role",
            "Update Employee Role",
            "Update Employee Manager",
            "Remove Employee",
            "Remove Role",
            "Remove Department"
        ]
    })
    .then((answer) => {
        operations[answer.action]();
    })
};

// modularise functions below


// search.js
function employeeSearch();

function departmentSearch();

function viewAllEmployees();

function viewEmployeesByDepartment();

function viewEmployeesByManager();

function departmentBudgetView();


// add.js
// Functions for adding
function addEmployee();

function addDepartment();

function addRole();

// Functions for updating
function updateEmployee();

function updateEmployeeManager();

// Function for deleting
function removeEmployee();

function removeRole();

function removeDepartment();

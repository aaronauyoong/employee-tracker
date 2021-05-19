// Dependencies
const inquirer = require("inquirer");
const mysql = require("mysql");
const cTable = require("console.table");
// Modularised functions
// const { employeeSearch, departmentSearch } = require('./operations/search');

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
	"Remove Department": removeDepartment,
	// Exit (TBD)
	Exit: exitApp,
};

// First function upon app initialisation
const runSearch = () => {
	inquirer
		.prompt({
			name: "action",
			type: "list",
			message:
				"Welcome to the Employee Tracker application. What would you like to do today?",
			choices: Object.keys(operations),
		})
		.then((answer) => {
			operations[answer.action]();
		});
};

// modularise functions below

// search.js
const employeeSearch = () => {
	inquirer
		.prompt([
			{
				name: "employeeSearch",
				type: "input",
				message:
					"Please enter the employee's first name to search for their details.",
			},
		])
		.then((answer) => {
			const query =
				"SELECT employee.id, first_name, last_name, roles.title, department.name, employee.manager_id";
			query +=
				"FROM employee LEFT JOIN (roles LEFT JOIN department ON department.id = roles.department_id)";
			query += "ON employee.role_id = roles.id WHERE employee.first_name = ?";
			console.log(answer.employeeSearch);
			connection.query(query, [answer.employeeSearch], (err, res) => {
				if (err) throw err;
				cTable(["ID", "FirstName", "LastName", "Department"], res);
				runSearch();
			});
		});
};

const departmentSearch = () => {
	inquirer
		.prompt([
			{
				name: "department",
				type: "input",
				message: "Please enter a department name to search for its details.",
			},
		])
		.then((answer) => {
			const query = `SELECT employee.id, first_name, last_name, role_id, department.name, roles.title, roles.salary `;
			query += `FROM employee LEFT JOIN (roles LEFT JOIN department ON department.id = roles.department_id) `;
			query += `ON employee.role_id = roles.id WHERE department.name = ?`;
			console.log(answer.department);
			connection.query(query, [answer.department], (err, res) => {
				if (err) throw err;
				cTable(["ID", "FirstName", "LastName", "Department"], res);
				runSearch();
			});
		});
};

const viewAllEmployees = () => {
	const query =
		"SELECT employee.id, first_name, last_name, roles.title, department.name, employee.manager_id";
	query +=
		"FROM employee LEFT JOIN (roles LEFT JOIN department ON department.id = roles.department_id)";
	query += "ON employee.role_id = roles.id ORDER BY employee.id";
	connection.query(query, (err, res) => {
		if (err) throw err;
		cTable(res);
		runSearch();
	});
};

const viewEmployeesByDepartment = () => {};

const viewEmployeesByManager = () => {};

const departmentBudgetView = () => {
    inquirer
    .prompt [(
        {
            name:"budget",
            type:"input",
            message:"Please enter a department name to see its total department budget utilization (per annum).",
        }
    )]
	const query = "SELECT department.id, department.name, roles.title, roles.salary";
    query += "department JOIN roles ON department.id = roles.department_id";
    query += "WHERE department.name = ?";
	connection.query(query, function (err, res) {
		if (err) throw err;
		cTable(res);
		runSearch();
	});
};

// add.js
// Functions for adding
const addEmployee = () => {};

const addDepartment = () => {};

const addRole = () => {};

// Functions for updating
const updateEmployee = () => {};

const updateEmployeeManager = () => {};

// Function for deleting
const removeEmployee = () => {};

const removeRole = () => {};

const removeDepartment = () => {};

// Function for exiting app
const exitApp = () => {};

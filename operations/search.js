// Dependencies
const inquirer = require("inquirer");
const cTable = require('console.table');
// search.js
const employeeSearch = async function () {
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
				"SELECT employee.id AS ID, first_name AS 'First Name', last_name AS 'Last Name', roles.title AS 'Role', department.name AS 'Department', employee.manager_id AS 'Manager ID' FROM employee LEFT JOIN (roles LEFT JOIN department ON department.id = roles.department_id) ON employee.role_id = roles.id WHERE employee.first_name = ?";
			connection.query(query, [answer.employeeSearch], (err, res) => {
				if (err) throw err;
				console.table(res);
				runSearch();
			});
		});
};

// function departmentSearch();

const viewAllEmployees = async function() {
	const query =
		"SELECT employee.id AS ID, first_name AS 'First Name', last_name AS 'Last Name', roles.title AS 'Role', department.name AS 'Department', employee.manager_id AS 'Manager ID' FROM employee LEFT JOIN (roles LEFT JOIN department ON department.id = roles.department_id) ON employee.role_id = roles.id ORDER BY employee.id";
	connection.query(query, (err, res) => {
		if (err) throw err;
		console.table(res);
		runSearch();
	});
};

// function viewEmployeesByDepartment();

// function viewEmployeesByManager();

// function departmentBudgetView();

module.exports = {
    employeeSearch,
    // departmentSearch,
    viewAllEmployees,
    // viewEmployeesByDepartment,
    // viewEmployeesByManager,
    // departmentBudgetView
};
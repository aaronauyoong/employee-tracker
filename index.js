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
	"Update Employee Role": updateEmployeeRole,
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

// Specific Employee Search (Extra)
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
				cTable(["ID", "First Name", "Last Name", "Role", "Department", "Manager ID"], res);
				runSearch();
			});
		});
};

// Searching for department (MinReq)
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
			const query = "SELECT employee.id, first_name, last_name, department.name, roles.title, roles.salary";
			query += "FROM employee LEFT JOIN (roles LEFT JOIN department ON department.id = roles.department_id)";
			query += "ON employee.role_id = roles.id WHERE department.name = ?";
			console.log(answer.department);
			connection.query(query, [answer.department], (err, res) => {
				if (err) throw err;
				cTable(["ID", "First Name", "Last Name", "Role", "Department", "Salary"], res);
				runSearch();
			});
		});
};

// View All Employees (MinReq)
const viewAllEmployees = () => {
	const query =
		"SELECT employee.id, first_name, last_name, roles.title, department.name, employee.manager_id";
	query +=
		"FROM employee LEFT JOIN (roles LEFT JOIN department ON department.id = roles.department_id)";
	query += "ON employee.role_id = roles.id ORDER BY employee.id";
	connection.query(query, (err, res) => {
		if (err) throw err;
		cTable(["ID", "First Name", "Last Name", "Role", "Department", "Manager ID"], res);
		runSearch();
	});
};

// View employees by department (Extra)
// Logic - search for department, show list of employees under that department
const viewEmployeesByDepartment = () => {
	const query = "";
	query += "";
	connection.query(query, (err, res) => {
		if (err) throw err;
		cTable(res);
		runSearch();
	});
};

// View employees by manager (Extra)
// Logic - search manager ID, show list of employees under that manager
const viewEmployeesByManager = () => {
	const query = "";
	query += "";
	connection.query(query, (err, res) => {
		if (err) throw err;
		cTable(res);
		runSearch();
	});
};

// View department budget utilization (Extra)
const departmentBudgetView = () => {
	inquirer.prompt[
		{
			name: "budget",
			type: "input",
			message:
				"Please enter a valid department ID to see its total department budget utilization (per annum).",
		}
	].then((answer) => {
		const query = "SUM(roles.salary) total_budget FROM roles WHERE department_id = ?"; 
        console.log(answer);

		connection.query(query, (err, res) => {
			if (err) throw err;
			cTable(["Total Department Budget"], res);
			runSearch();
		});
	});
};

// add.js

// Adding new employee (MinReq)
const addEmployee = () => {
    connection.query("SELECT * FROM role", (err, roles) => {
        if (err) throw err;
        connection.query("SELECT * FROM employee WHERE manager_id is null", function (err, managers) {
            if (err) throw err;

            inquirer.prompt([
                {
                    name: "firstName",
                    type: "input",
                    message: "Please enter the new employee's first name."
                },
                {
                    name: "lastName",
                    type: "input",
                    message: "Please enter the new employee's last name."
                },
                {
                    name: "employeeRole",
                    type: "list",
                    message: "Please select the new employee's role:",
                    choices: "" // TBD how to select new employee's role
                },
                {
                    name: "employeeManager",
                    type: "list",
                    message: "Please select the new employee's manager by name:",
                    choices: "" // TBD how to select new employee's manager
                }
            ]).then((answer) => {

                const query = "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)";

                connection.query(query, [answer.firstName, answer.lastName, answer.employeeRole, answer.employeeManager], (err) => {
                    if (err) throw err;
                    runSearch();
                })
            })
        })
    })
	const query = "";
	query += "";
	connection.query(query, (err, res) => {
		if (err) throw err;
		cTable(res);
		runSearch();
	});
	// con.connect(function(err) {
	//     if (err) throw err;
	//     con.query("SELECT * FROM customers", function (err, result, fields) {
	//       if (err) throw err;
	//       console.log(result);
	//     });
	//   });
};

// Adding new Department (MinReq)
const addDepartment = () => {
	const query = "";
	query += "";
	connection.query(query, (err, res) => {
		if (err) throw err;
		cTable(res);
		runSearch();
	});
};

// Adding new role (MinReq)
const addRole = () => {
	const query = "";
	query += "";
	connection.query(query, (err, res) => {
		if (err) throw err;
		cTable(res);
		runSearch();
	});
};

//Updating Employee Role (MinReq)
const updateEmployeeRole = () => {
	const query = "";
	query += "";
	connection.query(query, (err, res) => {
		if (err) throw err;
		cTable(res);
		runSearch();
	});
};

// Updating Employee Manager (Extra)
// Logic - TBC, need clarify
const updateEmployeeManager = () => {
	const managerList = [];

	inquirer.prompt([
		{
			name: "updateManager",
			type: "list",
			message: "Which employee's manager would you like to update?",
			choices: [],
		},
		{
			name: "setManager",
			type: "list",
			message:
				"Which employee do you want to set as manager for the selected employee?",
			choices: [],
		},
	]);

	const query = "";
	query += "";
	connection.query(query, (err, res) => {
		if (err) throw err;
		cTable(res);
		runSearch();
	});
};

// Function for deleting
const removeEmployee = () => {
	const query = "";
	query += "";
	connection.query(query, (err, res) => {
		if (err) throw err;
		cTable(res);
		runSearch();
	});
};

const removeRole = () => {
	const query = "";
	query += "";
	connection.query(query, (err, res) => {
		if (err) throw err;
		cTable(res);
		runSearch();
	});
};

const removeDepartment = () => {
	const query = "";
	query += "";
	connection.query(query, (err, res) => {
		if (err) throw err;
		cTable(res);
		runSearch();
	});
};

// Function for exiting app
const exitApp = () => {};

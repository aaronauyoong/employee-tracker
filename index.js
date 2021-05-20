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
	password: "rootPassword",
	database: "employee_DB",
});

connection.connect((err) => {
	if (err) throw err;
	runSearch();
});

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
				"SELECT employee.id AS ID, first_name AS 'First Name', last_name AS 'Last Name', roles.title AS 'Role', department.name AS 'Department', employee.manager_id AS 'Manager ID' FROM employee LEFT JOIN (roles LEFT JOIN department ON department.id = roles.department_id) ON employee.role_id = roles.id WHERE employee.first_name = ?";
			console.log(answer.employeeSearch);
			connection.query(query, [answer.employeeSearch], (err, res) => {
				if (err) throw err;
				console.table(res);
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
			const query =
				"SELECT employee.id AS ID, first_name AS 'First Name', last_name AS 'Last Name', department.name AS 'Department', roles.title AS 'Role' FROM employee LEFT JOIN (roles LEFT JOIN department ON department.id = roles.department_id) ON employee.role_id = roles.id WHERE department.name = ?";
			console.log(answer.department);
			connection.query(query, [answer.department], (err, res) => {
				if (err) throw err;
				console.table(res);
				runSearch();
			});
		});
};

const viewAllEmployees = () => {
	const query =
		"SELECT employee.id AS ID, first_name AS 'First Name', last_name AS 'Last Name', roles.title AS 'Role', department.name AS 'Department', employee.manager_id AS 'Manager ID' FROM employee LEFT JOIN (roles LEFT JOIN department ON department.id = roles.department_id) ON employee.role_id = roles.id ORDER BY employee.id";
	connection.query(query, (err, res) => {
		if (err) throw err;
		console.table(res);
		runSearch();
	});
};

const viewEmployeesByDepartment = () => {
	connection.query(
		"SELECT * FROM department ORDER BY id ASC",
		(err, departments) => {
			if (err) throw err;
			inquirer
				.prompt({
					name: "department",
					type: "list",
					message: "Please select a department from the list below.",
					choices: departments,
				})
				.then((answers) => {
					console.log(answers);
					const deptList = JSON.stringify(answers.department);
					const query = `
SELECT employee.first_name AS 'First Name', employee.last_name AS 'Last Name', roles.title AS 'Role', department.name AS 'Department'
FROM department 
LEFT JOIN roles ON (department.id = roles.department_id)
LEFT JOIN employee ON (roles.id = employee.role_id)
WHERE department.name = ${deptList}`;
					connection.query(query, (err, res) => {
						if (err) throw err;
						console.table(res);
						runSearch();
					});
				});
		}
	);
};

// View employees by manager (Extra) ---------> WIP
// Logic - search manager ID, show list of employees under that manager
const viewEmployeesByManager = () => {
	connection.query(`SELECT * FROM employee WHERE manager_id IS NULL;`, (err, managers) => {

        console.log("THESE ARE THE MANAGERS -------->", { managers });

        const managerName = JSON.stringify(managers);

        if (err) throw err;
        inquirer.prompt({
            name:"manager",
            type:"list",
            message:"Please select a manager from the list below, to see employees reporting to them:",
            choices: managers,

        }).then((answers) => {
            console.log(answers);
            const managerList = JSON.stringify(answers.managers.id);
            const query = `
SELECT first_name as 'First Name', last_name AS 'Last Name', roles.title AS 'Role', department.name AS 'Department'
FROM employee
LEFT JOIN roles ON (role_id = roles.id)
LEFT JOIN department ON (roles.department_id = department.id)
WHERE employee.manager_id = ${managerList}; 
`;
            connection.query(query, (err, res) => {
                if (err) throw err;
                console.table(res);
                runSearch();
            })
        })
    });
};

// View department budget utilization (Extra)
const departmentBudgetView = () => {
	inquirer
		.prompt([
			{
				name: "budget",
				type: "input",
				message:
					"Please enter a valid department ID to see its total department budget utilization (per annum).",
			},
		])
		.then((answers) => {
			const dept_ID = JSON.stringify(answers.budget);
			const query = `SELECT SUM(roles.salary) total_budget FROM roles WHERE department_id = ${dept_ID}`;

			connection.query(query, (err, res) => {
				if (err) throw err;
				console.table(res);
				runSearch();
			});
		});
};

// Adding new employee (MinReq)
const addEmployee = () => {
	connection.query("SELECT * FROM roles", (err, roles) => {
        
		if (err) throw err;
		connection.query(
			"SELECT * FROM employee WHERE manager_id IS null", (err, manager) => {
				if (err) throw err;

				inquirer
					.prompt([
						{
							name: "firstName",
							type: "input",
							message: "Please enter the new employee's first name.",
						},
						{
							name: "lastName",
							type: "input",
							message: "Please enter the new employee's last name.",
						},
						{
							name: "employeeRole",
							type: "list",
							message: "Please select the new employee's role:",
							choices: roles.map(({ id, title }) => {
                                return {
                                    name: title,
                                    value: {
                                        id, title
                                    }
                                }
                            }), 
						},
						{
							name: "employeeManager",
							type: "list",
							message: "Please select the new employee's manager by name:",
							choices: manager.map(({ id, first_name, last_name }) => {
                                return {
                                    name: first_name + " " + last_name,
                                    value: {
                                        id, first_name, last_name
                                    }
                                }
                            }), 
						},
					])
					.then((answer) => {
						const query =
							"INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)";

						connection.query(
							query,
							[
								answer.firstName,
								answer.lastName,
								answer.employeeRole.id,
								answer.employeeManager.id,
							],
							(err) => {
								if (err) throw err;
								console.log("Successfully added new employee!");
								runSearch();
							}
						);
					});
			}
		);
	});
};

// Adding new Department (MinReq)
const addDepartment = () => {
	const query = "";
	query += "";
	connection.query(query, (err) => {
		if (err) throw err;
		console.log("Successfully added new department!");
		runSearch();
	});
};

// Adding new role (MinReq)
const addRole = () => {
	const query = "";
	query += "";
	connection.query(query, (err) => {
		if (err) throw err;
		console.log("Successfully added new employee role!");
		runSearch();
	});
};

//Updating Employee Role (MinReq)
const updateEmployeeRole = () => {
	const query = "";
	query += "";
	connection.query(query, (err, res) => {
		if (err) throw err;
		console.table(res);
		console.log("Successfully updated employee!");
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
		console.table(res);
		console.log("Successfully updated employee manager!");
		runSearch();
	});
};

// Remove employee (Extra)
const removeEmployee = () => {
    connection.query("SELECT first_name, last_name, id FROM employee", (err, employee) => {
        // const employeeData = JSON.stringify(employee);
        console.log("This is employee ------> ", employee);

        if (err) throw err;
        inquirer.prompt([
            {
                name: "name",
                type: "list",
                message: "Which employee would you like to remove?",
                choices: employee, // map??
            }
        ]).then((answer) => {
            connection.query(`DELETE FROM employee WHERE id = ${answer.id}`, (err) => {
                if (err) throw err;
                console.log("Successfully removed employee!");
                runSearch();
            });
        });
    });
};

// Remove role (Extra)
const removeRole = () => {
	const query = "";
	query += "";
	connection.query(query, (err, res) => {
		if (err) throw err;
		console.log("Successfully removed employee role!");
		runSearch();
	});
};

// Remove department (Extra)
const removeDepartment = () => {
	const query = "";
	query += "";
	connection.query(query, (err, res) => {
		if (err) throw err;
		console.log("Successfully removed department!");
		runSearch();
	});
};

// Exit app
const exitApp = () => connection.end();

const operations = {
	// Search Data
	"Search For An Employee": employeeSearch,
	"Search For Department": departmentSearch,

	// View Data
	"View All Employees": viewAllEmployees,
	"View All Employees By Department": viewEmployeesByDepartment,
	"View All Employees By Manager": viewEmployeesByManager,
	"View Total Utilized Budget Of A Department": departmentBudgetView,

	// // Add Data
	"Add Employee": addEmployee,
	// "Add Department": addDepartment,
	// "Add Role": addRole,

	// // Update Data
	// "Update Employee Role": updateEmployeeRole,
	// "Update Employee Manager": updateEmployeeManager,

	// // Delete Data
	"Remove Employee": removeEmployee,
	// "Remove Role": removeRole,
	// "Remove Department": removeDepartment,

	// Exit
	Finish: exitApp,
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

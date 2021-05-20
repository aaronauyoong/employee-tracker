const inquirer = require("inquirer");
const mysql = require("mysql");
const cTable = require("console.table");
// Modularised functions
// const { employeeSearch, viewAllEmployees } = require("./operations/search");

const connection = mysql.createConnection({
	host: "localhost",
	port: 3306,
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
			connection.query(query, [answer.employeeSearch], (err, res) => {
				if (err) throw err;
				console.table(res);
				runSearch();
			});
		});
};

const departmentSearch = () => {
	connection.query("SELECT name FROM department", (err, department) => {
		if (err) throw err;
		const departmentList = department.map(({ id, name }) => {
			return { name: name, value: {id, name} };
		});
		inquirer
			.prompt([
				{
					name: "department",
					type: "list",
					message: "Which department would you like to search for?",
					choices: departmentList,
				},
			])
			.then((answer) => {
				const query = `SELECT employee.id AS ID, first_name AS 'First Name', last_name AS 'Last Name', department.name AS 'Department', roles.title AS 'Role' 
FROM employee 
LEFT JOIN roles ON employee.role_id = roles.id
LEFT JOIN department ON department.id = roles.department_id
WHERE department.name = "${answer.department.name}"`;
				connection.query(query, (err, res) => {
					if (err) throw err;
					console.table(res);
					runSearch();
				});
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

const viewAllDepartments = () => {
	const query = "SELECT id AS ID, name AS 'Department Name' FROM department";
	connection.query(query, (err, res) => {
		if (err) throw err;
		console.table(res);
		runSearch();
	});
};

const viewEmployeesByDepartment = () => {
	connection.query("SELECT * FROM department ORDER BY id ASC", (err, departments) => {
			if (err) throw err;
			inquirer
				.prompt({
					name: "department",
					type: "list",
					message: "Please select a department from the list below.",
					choices: departments,
				})
				.then((answers) => {
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

const viewEmployeesByManager = () => {
	connection.query(
		`SELECT * FROM employee WHERE manager_id IS NULL;`,
		(err, managers) => {
			const managerChoices = managers.map(
				({ id, first_name, last_name, role_id }) => {
					return { name: first_name + " " + last_name, value: {id, first_name, last_name, role_id} };
				}
			);
			if (err) throw err;
			inquirer
				.prompt({
					name: "manager",
					type: "list",
					message: "Please select a manager from the list below, to see employees reporting to them:",
					choices: managerChoices,
				})
				.then((answers) => {
					const managerList = answers.manager.id;
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
					});
				});
		}
	);
};

const departmentBudgetView = () => {
	return connection.query(`SELECT id, name FROM department`, (err, res) => {
		if (err) throw err;
		const deptChoices = res.map(({ id, name }) => {
			return { name: name, value: {id, name} };
		});
		inquirer
			.prompt({
				name: "department",
				type: "list",
				message: "Please select a department from the list below:",
				choices: deptChoices,
			})
			.then((answers) => {
				const query = `SELECT SUM(roles.salary) total_budget FROM roles WHERE department_id = ?`;
				connection.query(query, [answers.department.id], (err, res) => {
					if (err) throw err;
					console.table(res);
					runSearch();
				});
			});
	});
};

const addEmployee = () => {
	connection.query("SELECT * FROM roles", (err, roles) => {
		if (err) throw err;
		connection.query(
			"SELECT * FROM employee WHERE manager_id IS null",
			(err, manager) => {
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
										id,
										title,
									},
								};
							}),
						},
						{
							name: "employeeManager",
							type: "list",
							message: "Please select the new employee's manager by name:",
							choices: manager.map(({ id, first_name, last_name }) => {
								return { name: first_name + " " + last_name, value: {id, first_name, last_name} };
							}),
						},
					])
					.then((answer) => {
						const query =
							"INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)";
						connection.query(query, [answer.firstName, answer.lastName, answer.employeeRole.id, answer.employeeManager.id],
							(err) => {
								if (err) throw err;
								console.log("// ----- Successfully added new employee! -----  //");
								runSearch();
							}
						);
					});
			}
		);
	});
};

const addDepartment = () => {
	connection.query("SELECT * FROM department");
	inquirer
		.prompt([
			{
				name: "departmentName",
				type: "input",
				message: "Please enter the new department name.",
			},
		])
		.then((answer) => {
			const query = "INSERT INTO department (name) VALUES (?)";
			connection.query(query, [answer.departmentName], (err) => {
				if (err) throw err;
				console.log("// ----- Successfully added new department! -----  //");
				runSearch();
			});
		});
};

const addRole = () => {
	connection.query("SELECT * FROM department", (err, department) => {
		if (err) throw err;
		connection.query("SELECT * FROM roles", (err) => {
			if (err) throw err;
			inquirer
				.prompt([
					{
						name: "title",
						type: "input",
						message: "Please enter the title for the new employee role.",
					},
					{
						name: "salary",
						type: "input",
						message:
							"Please enter the annual salary amount up to 2 decimal places for the new employee role (e.g. 1000.00).",
					},
					{
						name: "department",
						type: "list",
						message:
							"Please select the department the new employee role will work under:",
						choices: department.map(({ id, name }) => {
							return { name: name, value: {id, name} };
						}),
					},
				])
				.then((answer) => {
					const query =
						"INSERT INTO roles (title, salary, department_id) VALUES (?,?,?)";
					connection.query(query, [answer.title, answer.salary, answer.department.id], (err) => {
							if (err) throw err;
							console.log("// ----- Successfully added a new employee role! -----  //");
							runSearch();
						}
					);
				});
		});
	});
};

const updateEmployeeRole = () => {

    connection.query("SELECT * FROM employee", (err, employee) => {
        if(err) throw err;
        console.log("THIS IS A CONSOLE LOG FOR EMPLOYEE*****", employee)
        connection.query("SELECT * FROM roles", (err, roles) => {
            console.log("THIS IS A CONSOLE LOG FOR ROLES", roles)
            if(err) throw err;
            inquirer.prompt([
                {
                    name: "employee",
                    type: "list",
                    message: "Please select the employee whose role you would like to update: ",
                    choices: employee.map(emp => ({ name: emp.first_name + " " + emp.last_name, value: emp.id}))
                },
                {
                    name:"role",
                    type: "list",
                    message: "Please select a new role for the chosen employee: ",
                    choices: roles.map(role => ({ name: role.title, value: role.id}))
                }
            ]).then((answer) => {
                connection.query("UPDATE employee SET role_id = ? WHERE id = ?", [answer.role, answer.employee], (err) => {
                    if (err) throw err;
                    console.log("// ----- Successfully updated employee role! -----  //");
                    runSearch();
                })

            })

    })
    })
};

const updateEmployeeManager = () => {
	connection.query("SELECT * FROM employee", (err, employee) => {
        if (err) throw err;
        connection.query("SELECT * FROM employee WHERE manager_id IS NULL", (err, manager) => {
            if (err) throw err;
            inquirer.prompt([
                {
                    name:"employee",
                    type:"list",
                    message:"Please select the employee you would like to update.",
                    choices: employee.map(emp => ({ name: emp.first_name + " " + emp.last_name, value: emp.id }))
                },
                {
                    name: "manager",
                    type: "list",
                    message: "Please select the chosen employee's new manager.",
                    choices: manager.map(man => ({ name: man.first_name + " " + man.last_name, value: man.id }))
                }
            ]).then((answer) => {
                connection.query("UPDATE employee SET manager_id = ? WHERE id = ?", [answer.manager, answer.employee], (err, res) => {
                    if (err) throw err;
                    console.log("// ----- Successfully updated the employee's manager! ----- //");
                    runSearch();
                })
            })
        })
    })
};

const removeEmployee = () => {
	connection.query("SELECT first_name, last_name, id FROM employee", (err, employee) => {
			if (err) throw err;
			const employeeList = employee.map(({ id, first_name, last_name }) => {
				return { name: first_name + " " + last_name, value: {id, first_name, last_name} };
			});
			inquirer
				.prompt([
					{
						name: "employee",
						type: "list",
						message: "Which employee would you like to remove?",
						choices: employeeList,
					},
				])
				.then((answer) => {
					connection.query(`DELETE FROM employee WHERE id = ${answer.employee.id}`, (err) => {
							if (err) throw err;
							console.log("// ----- Successfully removed employee! -----  //");
							runSearch();
						}
					);
				});
		}
	);
};

const removeRole = () => {
	connection.query("SELECT * FROM roles", (err, roles) => {
		if (err) throw err;
		const rolesList = roles.map(({ id, title, salary, department_id }) => {
			return { name: title, value: {id, title, salary, department_id} };
		});
		inquirer
			.prompt([
				{
					name: "role",
					type: "list",
					message: "Which role would you like to remove?",
					choices: rolesList,
				},
			])
			.then((answer) => {
				connection.query(`DELETE FROM roles WHERE id = ${answer.role.id}`, (err) => {
						if (err) throw err;
						console.log("// ----- Successfully removed employee role! -----  //");
						runSearch();
					}
				);
			});
	});
};

const removeDepartment = () => {
	connection.query("SELECT * FROM department", (err, department) => {
		if (err) throw err;
		const departmentList = department.map(({ id, name }) => {
			return { name: name, value: {id, name} };
		});
		inquirer
			.prompt([
				{
					name: "department",
					type: "list",
					message: "Which department would you like to remove?",
					choices: departmentList,
				},
			])
			.then((answer) => {
				connection.query(`DELETE FROM department WHERE id = ${answer.department.id}`, (err) => {
						if (err) throw err;
						console.log("// ----- Successfully removed department! -----  //");
						runSearch();
					}
				);
			});
	});
};

const exitApp = () => connection.end();

const operations = {
	"Search For A Specific Employee": employeeSearch,
	"Search For Specific Department Details": departmentSearch,
	"View All Employees": viewAllEmployees,
	"View All Departments": viewAllDepartments,
	"View All Employees By Department": viewEmployeesByDepartment,
	"View All Employees By Manager": viewEmployeesByManager,
	"View Total Utilized Budget Of A Department": departmentBudgetView,
	"Add Employee": addEmployee,
	"Add Department": addDepartment,
	"Add Role": addRole,
	"Update Employee Role": updateEmployeeRole,
	"Update Employee Manager": updateEmployeeManager,
	"Remove Employee": removeEmployee,
	"Remove Role": removeRole,
	"Remove Department": removeDepartment,
	"Finish": exitApp,
};

const runSearch = () => {
	inquirer
		.prompt({
			name: "action",
			type: "list",
			message: "Welcome to the Employee Tracker application. What would you like to do today?",
			choices: Object.keys(operations),
		})
		.then((answer) => {
			operations[answer.action]();
		});
};
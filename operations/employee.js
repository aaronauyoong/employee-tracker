const db = require('../db/connection');

const viewAllEmployees = () => {
	const query =
		"SELECT employee.id AS ID, first_name AS 'First Name', last_name AS 'Last Name', roles.title AS 'Role', department.name AS 'Department', employee.manager_id AS 'Manager ID' FROM employee LEFT JOIN (roles LEFT JOIN department ON department.id = roles.department_id) ON employee.role_id = roles.id ORDER BY employee.id";
	return db.query(query);
};


module.exports = {
    viewAllEmployees,
}

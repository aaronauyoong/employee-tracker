const mysql = require("mysql2");

const connection = mysql.createConnection({
	host: "localhost",
	port: 3306,
	user: "root",
	// Be sure to update with your own MySQL password!
	password: "rootPassword",
	database: "employee_DB",
});

function query(...params) {
	return connection
		.promise()
		.query(...params)
		.catch((err) => {
			throw new err();
		});
}

module.exports = {
	connection,
	query,
};

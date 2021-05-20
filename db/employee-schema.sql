DROP DATABASE IF EXISTS employee_DB;

CREATE DATABASE employee_DB;

USE employee_DB;

CREATE TABLE department (
	id INTEGER AUTO_INCREMENT NOT NULL,
    name VARCHAR(30) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE roles (
	id INTEGER AUTO_INCREMENT NOT NULL,
    title VARCHAR(30),
    salary DECIMAL(8, 2), 
    department_id INTEGER,
    PRIMARY KEY (id),
    FOREIGN KEY (department_id) REFERENCES department(id)
);

CREATE TABLE employee (
	id INTEGER AUTO_INCREMENT NOT NULL,
	first_name VARCHAR(30),
	last_name VARCHAR(30),
	role_id INTEGER,
	manager_id INTEGER,
    PRIMARY KEY (id),
    FOREIGN KEY (role_id) REFERENCES roles(id)
);

INSERT INTO department (id, name)
VALUES ("1", "I.T."), ("2", "Marketing"), ("3", "Human Resources");

INSERT INTO roles (id, title, salary, department_id)
VALUES 
("1", "Web Developer", "75000", "1"),
("2", "Software Team Lead", "110000", "1"),
("3", "Marketing Consultant", "65000", "2"),
("4", "Marketing Manager", "80000", "2"),
("5", "HR Admin", "60000", "3"),
("6", "HR Manager", "80000", "3");

INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES
("1", "Tayla", "Smith", "1", "3"),
("2", "Jason", "Lu", "1", "3"),
("3", "Ronnie", "Yoong", "2", null),
("4", "Nicole", "Allen", "3", "6"),
("5", "Mikaela", "Brady", "3", "6"),
("6", "Davin", "Lim", "4", null),
("7", "John", "Snow", "5", "8"),
("8", "Julie", "Allen", "6", null);

-- WORKS
SELECT employee.id, employee.first_name, employee.last_name, employee.manager_id 
FROM employee 
INNER JOIN roles 
ON employee.role_id = roles.id;

-- WORKS
SELECT roles.id, roles.title, roles.salary 
FROM roles 
INNER JOIN department 
ON roles.department_id = department.id;

-- WORKS
SELECT department.id AS department_id, department.name AS department_name, roles.title AS role_name, roles.salary AS role_salary
FROM department 
LEFT JOIN roles 
ON department.id = roles.department_id
WHERE department.name = "I.T.";

-- WORKS
SELECT 
	SUM(roles.salary)  total_budget
FROM
	roles
WHERE
	department_id = "1";

-- FAIL
SELECT department_id, department.name AS department_name, SUM(roles.salary) total_budget, 
FROM department
LEFT JOIN roles
ON department.id = roles.department_id
WHERE
	department_name = "I.T.";

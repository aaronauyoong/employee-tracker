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
    salary DECIMAL(8, 2), -- e.g. $10000000.00
    department_id INTEGER,
    PRIMARY KEY (id)
);

CREATE TABLE employee (
	id INTEGER AUTO_INCREMENT NOT NULL,
	first_name VARCHAR(30),
	last_name VARCHAR(30),
	role_id INTEGER,
	manager_id INTEGER,
    PRIMARY KEY (id)
);


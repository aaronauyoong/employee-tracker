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

\c employees

INSERT INTO department (name)
VALUES ('Software Development'),
       ('Human Resources'),
       ('Finance'),
       ('Marketing'),
       ('Sales');
       
INSERT INTO role (title, salary, department_id) 
VALUES ('Software Engineer', 100000, 1),
       ('HR Specialist', 80000, 2),
       ('Accountant', 75000, 3),
       ('Marketing Specialist', 70000, 4),
       ('Sales Associate', 60000, 5);

INSERT INTO employee (first_name, last_name, role_id, manager_id)   
VALUES ('Tonya', 'Johnson', 1, NULL),
       ('Bob', 'Stacks', 2, 1),
       ('Maxwell', 'Baldwin', 3, 2),
       ('David', 'White', 4, 3),
       ('Eve', 'Black', 5, 4),
       ('Derick', 'Brown', 1, 1),
       ('Samantha', 'Willis', 2, 2);
import { client, connectToDb } from './connection.js';
import inquirer from 'inquirer';
(async () => {
    await connectToDb();
})();
function mainMenu() {
    inquirer
        .prompt({
        type: 'list',
        name: 'action',
        message: 'What would you like to do?',
        choices: [
            'View All Departments',
            'View All Roles',
            'View All Employees',
            'Add a Department',
            'Add a Role',
            'Add an Employee',
            'Update an Employee Role',
            'EXIT'
        ]
    })
        .then((answer) => {
        switch (answer.action) {
            case 'View All Departments':
                viewDepartments();
                break;
            case 'View All Roles':
                viewRoles();
                break;
            case 'View All Employees':
                viewEmployees();
                break;
            case 'Add a Department':
                addDepartment();
                break;
            case 'Add a Role':
                addRole();
                break;
            case 'Add an Employee':
                addEmployee();
                break;
            case 'Update an Employee Role':
                updateEmployeeRole();
                break;
            case 'EXIT':
                client.end();
                break;
        }
    });
}
function viewDepartments() {
    client.query('SELECT * FROM department', function (err, res) {
        if (err)
            throw err;
        console.table(res.rows);
        mainMenu();
    });
}
function viewRoles() {
    client.query('SELECT role.id, role.title, department.name AS department, role.salary FROM role JOIN department ON role.department_id = department.id', function (err, res) {
        if (err)
            throw err;
        console.table(res.rows);
        mainMenu();
    });
}
function viewEmployees() {
    client.query(`SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, 
                  CONCAT(manager.first_name, ' ', manager.last_name) AS manager 
                  FROM employee 
                  JOIN role ON employee.role_id = role.id 
                  JOIN department ON role.department_id = department.id 
                  LEFT JOIN employee manager ON employee.manager_id = manager.id`, function (err, res) {
        if (err)
            throw err;
        console.table(res.rows);
        mainMenu();
    });
}
function addDepartment() {
    inquirer
        .prompt({
        type: 'input',
        name: 'name',
        message: 'Enter the name of the department:'
    })
        .then((answer) => {
        client.query('INSERT INTO department (name) VALUES ($1)', [answer.name], function (err) {
            if (err)
                throw err;
            console.log('Department added successfully');
            mainMenu();
        });
    });
}
function addRole() {
    client.query('SELECT * FROM department', function (err, res) {
        if (err)
            throw err;
        const departments = res.rows.map(department => ({ name: department.name, value: department.id }));
        inquirer
            .prompt([
            {
                type: 'input',
                name: 'title',
                message: 'Enter the title of the role:'
            },
            {
                type: 'input',
                name: 'salary',
                message: 'Enter the salary of the role:'
            },
            {
                type: 'list',
                name: 'department_id',
                message: 'Select the department for the role:',
                choices: departments
            }
        ])
            .then((answers) => {
            client.query('INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3)', [answers.title, answers.salary, answers.department_id], function (err) {
                if (err)
                    throw err;
                console.log('Role added successfully');
                mainMenu();
            });
        });
    });
}
function addEmployee() {
    client.query('SELECT * FROM role', function (err, res) {
        if (err)
            throw err;
        const roles = res.rows.map(role => ({ name: role.title, value: role.id }));
        client.query('SELECT * FROM employee', function (err, res) {
            if (err)
                throw err;
            const managers = res.rows.map(manager => ({ name: `${manager.first_name} ${manager.last_name}`, value: manager.id }));
            managers.unshift({ name: 'None', value: null });
            inquirer
                .prompt([
                {
                    type: 'input',
                    name: 'first_name',
                    message: 'Enter the first name of the employee:'
                },
                {
                    type: 'input',
                    name: 'last_name',
                    message: 'Enter the last name of the employee:'
                },
                {
                    type: 'list',
                    name: 'role_id',
                    message: 'Select the role for the employee:',
                    choices: roles
                },
                {
                    type: 'list',
                    name: 'manager_id',
                    message: 'Select the manager for the employee:',
                    choices: managers
                }
            ])
                .then((answers) => {
                client.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)', [answers.first_name, answers.last_name, answers.role_id, answers.manager_id], function (err) {
                    if (err)
                        throw err;
                    console.log('Employee added successfully');
                    mainMenu();
                });
            });
        });
    });
}
function updateEmployeeRole() {
    client.query('SELECT * FROM employee', function (err, res) {
        if (err)
            throw err;
        const employees = res.rows.map(employee => ({ name: `${employee.first_name} ${employee.last_name}`, value: employee.id }));
        client.query('SELECT * FROM role', function (err, res) {
            if (err)
                throw err;
            const roles = res.rows.map(role => ({ name: role.title, value: role.id }));
            inquirer
                .prompt([
                {
                    type: 'list',
                    name: 'employee_id',
                    message: 'Select the employee to update:',
                    choices: employees
                },
                {
                    type: 'list',
                    name: 'role_id',
                    message: 'Select the new role for the employee:',
                    choices: roles
                }
            ])
                .then((answers) => {
                client.query('UPDATE employee SET role_id = $1 WHERE id = $2', [answers.role_id, answers.employee_id], function (err) {
                    if (err)
                        throw err;
                    console.log('Employee role updated successfully');
                    mainMenu();
                });
            });
        });
    });
}
mainMenu();

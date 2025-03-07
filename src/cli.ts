//The below files connects client and connectToDb to this file and uses teh inquier packaged needed to run our cli program. 
import { client, connectToDb } from './connection.js';
import inquirer from 'inquirer';
// import logo from 'asciiart-logo';
//This import adds a package that lets our table display the different colors. 
import table from 'console-table-printer';
const { Table } = table;

(async () => {
    await connectToDb();
})();
// This calls our prompts to start running our program. 
function mainMenu() {
    // console.log(logo({
    //     name:'Welcome to the Employee Tracker',
    //     logoColor: 'red',
    // }).render());

    inquirer
        .prompt({
            type: 'list',
            name: 'action',
            message: 'What would you like to do?',
            choices: [
                'View All Departments',
                'View All Employees',
                'View All Roles',
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
//This function will display the departments in a table format.
function viewDepartments() {
    client.query('SELECT * FROM department', function (err, res) {
        if (err) throw err;
        // console.table(res.rows);
        const p = new Table({
            columns: [
                { name: 'id', alignment: 'center', color: 'red' },
                { name: 'name', alignment: 'center', color: 'blue' }
            ]
        });
        p.addRows(res.rows);
        p.printTable();
        // printTable(res.rows);
        mainMenu();
    });
}
//This function will display the roles in a table format.
function viewRoles() {
    client.query('SELECT role.id, role.title, department.name AS department, role.salary FROM role JOIN department ON role.department_id = department.id', function (err, res) {
        if (err) throw err;const p = new Table({
            columns: [
                { name: 'title', alignment: 'center', color: 'red' },
                { name: 'salary', alignment: 'center', color: 'green' }
            ]
        });
        p.addRows(res.rows);
        p.printTable();
        mainMenu();
    });
}
//This function will display the employees in a table format.
function viewEmployees() {
    client.query(`SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, 
                  CONCAT(manager.first_name, ' ', manager.last_name) AS manager 
                  FROM employee 
                  JOIN role ON employee.role_id = role.id 
                  JOIN department ON role.department_id = department.id 
                  LEFT JOIN employee manager ON employee.manager_id = manager.id`, function (err, res) {
        if (err) throw err;
        const p = new Table({
            columns: [
                { name: 'id', alignment: 'center', color: 'white' },
                { name: 'first_name', alignment: 'center', color: 'blue' },
                { name: 'last_name', alignment: 'center', color: 'yellow' },
                { name: 'title', alignment: 'center', color: 'green' },
                { name: 'department', alignment: 'center', color: 'red' },
                { name: 'salary', alignment: 'center', color: 'green' },
                { name: 'manager', alignment: 'center', color: 'magenta' }
            ]
        });
        p.addRows(res.rows);
        p.printTable();
        mainMenu();
    });
}
//This function will add a department to the table.
function addDepartment() {
    inquirer
        .prompt({
            type: 'input',
            name: 'name',
            message: 'Enter the name of the department:'
        })
        .then((answer) => {
            client.query('INSERT INTO department (name) VALUES ($1)', [answer.name], function (err, ) {
                if (err) throw err;
                console.log('Department added successfully');
                mainMenu();
            });
        });
}

//This function will add a role to the table.
function addRole() {
    client.query('SELECT * FROM department', function (err, res) {
        if (err) throw err;
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
                client.query('INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3)', [answers.title, answers.salary, answers.department_id], function (err,) {
                    if (err) throw err;
                    console.log('Role added successfully');
                    mainMenu();
                });
            });
    });
}
//This function will add an employee to the table.
function addEmployee() {
    client.query('SELECT * FROM role', function (err, res) {
        if (err) throw err;
        const roles = res.rows.map(role => ({ name: role.title, value: role.id }));
        client.query('SELECT * FROM employee', function (err, res) {
            if (err) throw err;
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
                    client.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)', [answers.first_name, answers.last_name, answers.role_id, answers.manager_id], function (err,) {
                        if (err) throw err;
                        console.log('Employee added successfully');
                        mainMenu();
                    });
                });
        });
    });
}
//This function will update the employee role in the table.
function updateEmployeeRole() {
    client.query('SELECT * FROM employee', function (err, res) {
        if (err) throw err;
        const employees = res.rows.map(employee => ({ name: `${employee.first_name} ${employee.last_name}`, value: employee.id }));
        client.query('SELECT * FROM role', function (err, res) {
            if (err) throw err;
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
                    client.query('UPDATE employee SET role_id = $1 WHERE id = $2', [answers.role_id, answers.employee_id], function (err, ) {
                        if (err) throw err;
                        console.log('Employee role updated successfully');
                        mainMenu();
                    });
                });
        });
    });
}

mainMenu();
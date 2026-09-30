const {test,expect} = require('@playwright/test');
const {POManager} = require('../pageObjects/POManager');
const dataset = JSON.parse(JSON.stringify(require('../utils/orangeHrmTestData.json')));

for (const data of dataset){
    test('add employee, find in employee list and logout ', async ({page}) => {
        const poManager = new POManager(page);
        const loginPage = poManager.getLoginPage();
        const dashboardPage = poManager.getDashBoardPage();
        const pimPage = poManager.getPIMPage();

        const randomIndex = Math.floor(Math.random()*data.EMPLOYEES.length);
        const employee = {
            firstName: data.EMPLOYEES[randomIndex].firstName,
            lastName: data.EMPLOYEES[randomIndex].lastName,
            employeeId: Math.floor(10000000 + Math.random()*90000000).toString(),

        };

        await loginPage.goToLoginPage();
        await loginPage.validateLoginPage(data.VALID_USERNAME, data.VALID_PASSWORD);
        await expect(page).toHaveURL(/dashboard/);

        await dashboardPage.navigateToPIM();
        await pimPage.openAddEmployee();
        await pimPage.addEmployee(employee);
        await expect(page).toHaveURL(/pim\/viewPersonalDetails/);

        await pimPage.openEmployeeList();
        await pimPage.searchEmployeeById(employee.employeeId);
        const employeeRow = pimPage.getEmployeeRow(employee.employeeId);
        await expect(employeeRow).toHaveCount(1);

        await dashboardPage.logout();
        await expect(page.getByRole('textbox', { name: 'Username' })).toBeVisible();




    });
}
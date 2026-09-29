const {test,expect} = require('@playwright/test');
const {POManager} = require('../pageObjects/POManager');
const dataset = JSON.parse(JSON.stringify(require('../utils/orangeHrmTestData.json')));
for (const data of dataset){
test('displays an error for invalid login credentials', async ({page}) => {
    const poManager = new POManager(page);
    const loginPage = poManager.getLoginPage();

    await loginPage.goToLoginPage();
    await loginPage.validateLoginPage(data.INVALID_USERNAME, data.INVALID_PASSWORD);
    await expect(loginPage.errorMessage).toHaveText('Invalid credentials');
});
}
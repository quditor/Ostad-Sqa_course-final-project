const{test,expect} = require('@playwright/test');
const {POManager} = require('../pageObjects/POManager');

const dataset = JSON.parse(JSON.stringify(require('../utils/orangeHrmTestData.json')));
for (const data of dataset){
test('edits a user role and verifies the chnage persists after page refresh ', async({page}) => {
    const poManager = new POManager(page);
    const loginPage = poManager.getLoginPage();
    const dashboardPage = poManager.getDashBoardPage();
    const adminPage = poManager.getAdminPage();
    const targetUser = data.TARGET_USERNAME;

    await loginPage.goToLoginPage();
    await loginPage.validateLoginPage(data.VALID_USERNAME, data.VALID_PASSWORD);
    await expect(page).toHaveURL(/dashboard/);

    await dashboardPage.navigateToAdmin();
    await expect(page).toHaveURL(/admin\/viewSystemUsers/);

    await adminPage.searchUserByName(targetUser);

    const userRow = adminPage.getUserRow(targetUser);
    
    await expect(userRow).toHaveCount(1);
    await expect(userRow).toContainText(targetUser);

    const before = await adminPage.getUserRowDetails(targetUser);

    let newRole;
    if (before.role === "Admin"){
        newRole = 'ESS'
    }
    else {
        newRole = "Admin";
    }

    let newStatus;
    if(before.newStatus === "Enabled"){
        newStatus = "Disabled";
    }
    else {
        newStatus = "Enabled";
    }

    await adminPage.openEditForUser(targetUser);
    await adminPage.optionRoleAndStatus(newRole, newStatus);
    await expect(page).toHaveURL(/admin\/viewSystemUsers/);
    await expect(adminPage.resultRows.first()).toBeVisible();
     
    await page.reload();
    await adminPage.searchUserByName(targetUser);
    const after = await adminPage.getUserRowDetails(targetUser);
    expect(after.role).toBe(newRole);
    expect(after.status).toBe(newStatus);
});
}
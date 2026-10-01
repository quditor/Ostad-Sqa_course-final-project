const{test,expect} = require('@playwright/test');
const{POManager} = require('../pageObjects/POManager');
const dataset = JSON.parse(JSON.stringify(require('../utils/orangeHrmTestData.json')));
for(const data of dataset){
    test('apply leave , check pending approval , then cancel ', async({page}) => {
        const poManager = new POManager(page);
        const loginPage = poManager.getLoginPage();
        const dashboardPage = poManager.getDashBoardPage();
        const leavePage = poManager.getLeavePage();

        await loginPage.goToLoginPage();
        await loginPage.validateLoginPage(data.VALID_USERNAME, data.VALID_PASSWORD);
        await expect(page).toHaveURL(/dashboard/);

        await dashboardPage.navigateToLeave();

        await leavePage.openApplyLeave();

        await leavePage.applyForLeave(data.LEAVE_FROM_DATE, data.LEAVE_TO_DATE);

        await leavePage.openMyLeave();
        const pendingRow = leavePage.getLeaveRow(data.LEAVE_FROM_DATE, 'Pending Approval');
        await expect(pendingRow).toHaveCount(1);

        await leavePage.cancelLeave(pendingRow);
        await expect(pendingRow).toHaveCount(0);

        const cancelledRow = leavePage.getLeaveRow(data.LEAVE_FROM_DATE, 'Cancelled');
        await expect(cancelledRow.first()).toBeVisible();
    
    });

    
}
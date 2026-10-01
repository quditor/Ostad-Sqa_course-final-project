class LeavePage{
    constructor(page){
        this.page =page;
        this.applyMenu = page.getByRole('link', { name: 'Apply', exact: true });
        this.myLeaveMenu = page.getByRole('link', { name: 'My Leave' , exact : true });
        this.leaveTypeDropdown = page.locator('div.oxd-select-text.oxd-select-text--active');
        this.leaveTypeOption = page.getByRole("option",{name : "US - Personal"});
        this.fromDate = page.locator("//label[normalize-space()='From Date']/../..//input[@placeholder='yyyy-dd-mm']");
        this.toDate = page.locator("//label[normalize-space()='To Date']//following::input[@placeholder='yyyy-dd-mm']");
        this.applyButton = page.getByRole('button', { name: 'Apply' });
        this.rows = page.locator(".oxd-table-body .oxd-table-card ");


    }
    async openApplyLeave(){
        await this.applyMenu.click();
    }
    async openMyLeave(){
        await this.myLeaveMenu.click();
    }
    async applyForLeave(from,to){
        await this.leaveTypeDropdown.click();
        await this.leaveTypeOption.click();
        await this.fromDate.fill(from);
        await this.toDate.clear();
        await this.toDate.fill(to);
        await this.applyButton.click();

    }
    getLeaveRow(from,status){
        return this.rows.filter({hasText: from}).filter({hasText : status}).first();

    }
    async cancelLeave(row){
        await row.locator('button').filter({ hasText: 'Cancel' }).first().click();

    }
}
module.exports = {LeavePage};
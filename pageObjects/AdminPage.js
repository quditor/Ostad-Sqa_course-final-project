class AdminPage {
    constructor(page){
        this.page = page;
        this.usernameSearchInput = page.locator("//label[normalize-space()='Username']//following::input[@class='oxd-input oxd-input--active']");
        this.userRoleDropdown = page.locator("//label[normalize-space()='User Role']/../..//div[@class='oxd-select-text oxd-select-text--active']");
        this.statusDropdown = page.locator("//label[normalize-space()='Status']//following::div[@class='oxd-select-text oxd-select-text--active']");
        this.searchButton = page.getByRole('button',{name : 'Search'});

        this.resultRows = page.locator('.oxd-table-body .oxd-table-card');

        this.saveButton = page.getByRole('button', {name : 'Save'});
        this.succesToast = page.locator('.oxd-toast');



    }
    async searchUserByName(username){
        await this.usernameSearchInput.fill(username);
        await this.searchButton.click();
        await this.resultRows.first().waitFor();
    }
    async getResultUsernames(){
        const count = await this.resultRows.count();
        const usernames = [];
        for (let i = 0; i < count; i++){
            const text = await this.resultRows.nth(i).locator('.oxd-table-cell').nth(1).innerText();
            usernames.push(text.trim());
        }
        return usernames;

    }
    getUserRow(username){
      return this.resultRows.filter({ has: this.page.locator('.oxd-table-cell', { hasText: username }) })
            .first();
    }
    async getUserRowDetails(username){
        const row = this.getUserRow(username);
        const role = await row.locator('.oxd-table-cell').nth(2).innerText();
        const status = await row.locator('.oxd-table-cell').nth(4).innerText();
        return {role : role.trim(),status : status.trim()};

    }
    async openEditForUser(username){
         await this.getUserRow(username).locator(' .oxd-icon.bi-pencil-fill').click();
         await this.saveButton.waitFor();    
    }
    async selectDropDownOption(dropdown,optionText){
        await dropdown.click();
        await this.page.getByRole('option', { name: optionText, exact: true }).click();
    }
    async optionRoleAndStatus(role, status){
        await this.selectDropDownOption(this.userRoleDropdown, role);
        await this.selectDropDownOption(this.statusDropdown, status);
        await this.saveButton.click();

    }
}
module.exports = {AdminPage};
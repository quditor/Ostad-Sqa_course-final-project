class PIMPage {
    constructor(page){
        this.page =page;
        this.addemployeelink = page.getByRole('link', { name: 'Add Employee' });
        this.firstNameInput = page.getByRole('textbox', { name: 'First Name' });
        this.lastNameInput =  page.getByRole('textbox', { name: 'Last Name' });
        this.employeeIdInput = page.locator("//label[text()='Employee Id']/ancestor::div[contains(@class,'oxd-input-group')]//input");
        this.saveButton = page.getByRole('button', { name: 'Save' });
        this.pimMenuLink = page.getByRole('link', { name: 'PIM' });
        this.searchButton = page.getByRole('button', { name: 'Search' });

    }
    async openAddEmployee(){
        await this.addemployeelink.click();
    }
    async addEmployee(employee){
        await this.firstNameInput.fill(employee.firstName);
        await this.lastNameInput.fill(employee.lastName);
        await this.employeeIdInput.fill(employee.employeeId);
        await this.saveButton.click();
    }
    async openEmployeeList(){
       await this.pimMenuLink.click();
    }
    async searchEmployeeById(employeeId){
        await this.employeeIdInput.fill(employeeId);
        await this.searchButton.click();
    }
    getEmployeeRow(employeeId){
        return this.page.getByRole('row').filter({ hasText: employeeId });
    }
}
module.exports = {PIMPage};
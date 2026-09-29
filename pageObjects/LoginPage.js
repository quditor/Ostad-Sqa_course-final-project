class LoginPage{
    constructor(page) {
        this.page = page;
        this.usernameInput = page.getByRole('textbox', { name: 'Username' });
        this.passwordInput = page.getByPlaceholder('Password');
        this.loginButton = page.getByRole('button', { name: 'Login' });
        this.errorMessage = page.locator('.oxd-alert-content-text');
      
    }
    async goToLoginPage(){
        await this.page.goto(process.env.LOGIN_URL);
    }
    async validateLoginPage(username,password){
       await this.usernameInput.fill(username);
       await this.passwordInput.fill(password);
       await this.loginButton.click();
    }
}
module.exports = {LoginPage};
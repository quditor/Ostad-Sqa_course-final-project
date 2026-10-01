const { LoginPage } = require("./LoginPage");
const {PIMPage} = require('./PIMPage');
const {DashBoardPage} = require('./DashBoardPage');
const {AdminPage} = require('./AdminPage');
class POManager{
    constructor(page){
        this.page = page;
        this.loginPage = new LoginPage(this.page);
        this.pimPage = new PIMPage(this.page);
        this.dashboardPage = new DashBoardPage(this.page);
        this.adminPage = new AdminPage(this.page);

        
    }
    getLoginPage(){
        return this.loginPage;
    }
    getPIMPage(){
        return this.pimPage;
    }
    getDashBoardPage(){
        return this.dashboardPage;
    }
    getAdminPage(){
        return this.adminPage;
    }
}
module.exports = {POManager};
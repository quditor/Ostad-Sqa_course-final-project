const { LoginPage } = require("./LoginPage");
const {PIMPage} = require('./PIMPage');
const {DashBoardPage} = require('./DashBoardPage');
class POManager{
    constructor(page){
        this.page = page;
        this.loginPage = new LoginPage(this.page);
        this.pimPage = new PIMPage(this.page);
        this.dashboardPage = new DashBoardPage(this.page);

        
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
}
module.exports = {POManager};
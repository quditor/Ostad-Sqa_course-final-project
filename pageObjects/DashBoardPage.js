class DashBoardPage{
    constructor(page){
        this.page = page;
        this.pimMenuLink = page.getByRole('link', { name: 'PIM' });
        this.adminLink = page.getByRole('link', { name: 'Admin', exact: true });
        this.leaveLink = page.getByRole('link', { name: 'Leave', exact: true });
        this.profileMenu = page.locator('.oxd-userdropdown-tab');
        this.logMenuItem = page.getByRole('menuitem', { name: 'Logout' });
    }
    async navigateToPIM(){
        await this.pimMenuLink.click();
    }
    async navigateToAdmin(){
        await this.adminLink.click();
    }
    async navigateToLeave(){
        await this.leaveLink.click();
    }
    async logout(){
    await this.profileMenu.click();
    await this.logMenuItem.click();
    }
}
module.exports = {DashBoardPage};
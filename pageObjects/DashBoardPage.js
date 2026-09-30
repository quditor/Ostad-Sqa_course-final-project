class DashBoardPage{
    constructor(page){
        this.page = page;
        this.pimMenuLink = page.getByRole('link', { name: 'PIM' });
        this.profileMenu = page.locator('.oxd-userdropdown-tab');
        this.logMenuItem = page.getByRole('menuitem', { name: 'Logout' });
    }
    async navigateToPIM(){
        await this.pimMenuLink.click();
    }
    async logout(){
    await this.profileMenu.click();
    await this.logMenuItem.click();
    }
}
module.exports = {DashBoardPage};
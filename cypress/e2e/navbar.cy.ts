describe('navbar', () => {
    beforeEach(() => {
        cy.loginToKeycloak('test', 'test');
    });

    it('should be visbile and contains breadcrumbs', () => {
        cy.getByDataCy('navbar').should('be.visible');
        cy.getByDataCy('profile-btn').should('be.visible');
        cy.getByDataCy('logout-btn').should('be.visible');
        cy.getByDataCy('profile-icon-btn').should('not.be.visible');
        cy.getByDataCy('logout-icon-btn').should('not.be.visible');
        cy.getByDataCy('breadcrumbs').should('be.visible').contains('Domov');
    });

    it('should be visbile and contains breadcrumbs on small screen', () => {
        cy.viewport('iphone-se2')
        cy.getByDataCy('navbar').should('be.visible');
        cy.getByDataCy('profile-btn').should('not.be.visible');
        cy.getByDataCy('logout-btn').should('not.be.visible');
        cy.getByDataCy('profile-icon-btn').should('be.visible');
        cy.getByDataCy('logout-icon-btn').should('be.visible');
        cy.getByDataCy('breadcrumbs').should('be.visible').contains('Domov');
    });

    it('should display correct breadcrumb for each url', () => {
        cy.visit('/add');
        cy.getByDataCy('breadcrumbs').should('have.text', 'Domov/Nový záznam');
        cy.visit('/customer');
        cy.getByDataCy('breadcrumbs').should('have.text', 'Domov/Zákazník');
        cy.visit('/customer/add');
        cy.getByDataCy('breadcrumbs').should('have.text', 'Domov/Zákazník/Nový záznam');
        cy.visit('/vehicle');
        cy.getByDataCy('breadcrumbs').should('have.text', 'Domov/Vozidlo');
        cy.visit('/vehicle/add');
        cy.getByDataCy('breadcrumbs').should('have.text', 'Domov/Vozidlo/Nový záznam');
        cy.visit('/');
        cy.getByDataCy('breadcrumbs').should('have.text', 'Domov');
    })
});

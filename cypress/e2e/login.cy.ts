describe('login', () => {
    beforeEach(() => {
        cy.task('db:seed');
        cy.fixture('authentication').then((authentication) => {
            cy.loginToKeycloak(authentication.username, authentication.password);
        });
    });

    it('should successfully log in', () => {
        cy.getByDataCy('navbar').should('be.visible');
        cy.getByDataCy('profile-btn').should('be.visible');
        cy.getByDataCy('logout-btn').should('be.visible');
        cy.getByDataCy('breadcrumbs').should('be.visible').contains('Domov');
    });

    it('should successfully log out', () => {
        cy.getByDataCy('navbar').should('be.visible');
        cy.getByDataCy('logout-btn').should('be.visible');
        cy.getByDataCy('logout-btn').click();
        cy.origin('http://localhost/auth/*', () => {
            cy.get('h1[id="kc-page-title"]').should('be.visible');
            cy.get('input[id="username"]').should('be.visible');
            cy.get('input[id="password"]').should('be.visible');
        });
    });
});

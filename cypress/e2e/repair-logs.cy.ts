describe('repair logs', () => {
    beforeEach(() => {
        cy.loginToKeycloak('test', 'test');
    });

    it('should have search field and action buttons', () => {
        cy.getByDataCy('query-search-field').should('be.visible');
        cy.getByDataCy('query-search-field-help').should(
            'have.text',
            'Vyhľadáva podľa obsahu textu, EČ, VIN, výrobcu, modelu a zákazníka.'
        );
        cy.getByDataCy('query-search-field')
            .find('button')
            .should('have.attr', 'title')
            .and('match', /Vyhľadať/);
        cy.getByDataCy('add-records-btn')
            .should('be.visible')
            .should('have.attr', 'title')
            .and('match', /Pridať záznam opravy/);
        cy.getByDataCy('customers-btn')
            .should('be.visible')
            .should('have.attr', 'title')
            .and('match', /Zákazníci/);
        cy.getByDataCy('vehicles-btn')
            .should('be.visible')
            .should('have.attr', 'title')
            .and('match', /Vozidlá/);
    });
});

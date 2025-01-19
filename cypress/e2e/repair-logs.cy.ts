describe('repair logs', () => {
    beforeEach(() => {
        cy.task('db:seed');
        cy.fixture('authentication').then((authentication) => {
            cy.directLogin(authentication.username, authentication.password);
        });
    });

    it('should have search field, action buttons and records visible', () => {
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

        cy.getByDataCy('search-result-list').should('be.visible');
        cy.getByDataCy('search-result-list-item').as('items').should('have.length', 10);
        cy.get('@items').first().find('[data-cy="search-result-item-content"]').as('first-item').should('be.visible');
        cy.getByDataCy('pagination').should('be.visible').find('li').should('have.length', 4);

        cy.get('@first-item').children().first().should('contain.text', 'BB444AA');
        cy.get('@first-item').children().first().should('contain.text', 'Zákazník:MartinKrátky');
        cy.get('@first-item').children().first().should('contain.text', 'Stav odometra: 250 866km');
        cy.get('@first-item').children().last().should('contain.text', 'Prehliadka pred STK/EK');
    });

    it('should navigate to second page', () => {
        cy.getByDataCy('pagination').find('[aria-label="Go to page 2"]').click();

        cy.getByDataCy('search-result-list').should('be.visible');
        cy.getByDataCy('search-result-list-item').as('items').should('have.length', 1);
        cy.get('@items').first().find('[data-cy="search-result-item-content"]').as('first-item').should('be.visible');
        cy.get('@first-item').children().first().should('contain.text', 'AC000AA');
        cy.get('@first-item').children().first().should('contain.text', 'Zákazník:DávidSuchý');
        cy.get('@first-item').children().first().should('contain.text', 'Stav odometra: 87 568km');
        cy.get('@first-item').children().last().should('contain.text', 'Oprava kúrenia');
    });

    it('should change page size', () => {
        cy.getByDataCy('page-size').click();
        cy.get('li[data-value="25"]').click();
        cy.getByDataCy('search-result-list-item').as('items').should('have.length', 11);
    });

    it('should search by client name', () => {
        cy.getByDataCy('query-search-field').type('david');

        cy.getByDataCy('search-result-list').should('be.visible');
        cy.getByDataCy('search-result-list-item').as('items').should('have.length', 1);
        cy.get('@items').first().find('[data-cy="search-result-item-content"]').as('first-item').should('be.visible');
        cy.get('@first-item').children().first().should('contain.text', 'AC000AA');
        cy.get('@first-item').children().first().should('contain.text', 'Zákazník:DávidSuchý');
        cy.get('@first-item').children().first().should('contain.text', 'Stav odometra: 87 568km');
        cy.get('@first-item').children().last().should('contain.text', 'Oprava kúrenia');
    });

    it('should search by evidence number', () => {
        cy.getByDataCy('query-search-field').type('BB444AA');

        cy.getByDataCy('search-result-list').should('be.visible');
        cy.getByDataCy('search-result-list-item').as('items').should('have.length', 2);
        cy.get('@items').first().find('[data-cy="search-result-item-content"]').as('first-item').should('be.visible');
        cy.get('@first-item').children().first().should('contain.text', 'BB444AA');
        cy.get('@first-item').children().first().should('contain.text', 'Zákazník:MartinKrátky');
        cy.get('@first-item').children().first().should('contain.text', 'Stav odometra: 250 866km');
        cy.get('@first-item').children().last().should('contain.text', 'Prehliadka pred STK/EK');
        cy.get('@items').last().find('[data-cy="search-result-item-content"]').as('last-item').should('be.visible');
        cy.get('@last-item').children().first().should('contain.text', 'BB444AA');
        cy.get('@last-item').children().first().should('contain.text', 'Zákazník:MartinKrátky');
        cy.get('@last-item').children().first().should('contain.text', 'Stav odometra: 189 000km');
        cy.get('@last-item').children().last().should('contain.text', 'Výmena rozvodov');
    });

    it('should search by content', () => {
        cy.getByDataCy('query-search-field').type('stk');

        cy.getByDataCy('search-result-list').should('be.visible');
        cy.getByDataCy('search-result-list-item').as('items').should('have.length', 1);
        cy.get('@items').first().find('[data-cy="search-result-item-content"]').as('first-item').should('be.visible');
        cy.get('@first-item').children().first().should('contain.text', 'BB444AA');
        cy.get('@first-item').children().first().should('contain.text', 'Zákazník:MartinKrátky');
        cy.get('@first-item').children().first().should('contain.text', 'Stav odometra: 250 866km');
        cy.get('@first-item').children().last().should('contain.text', 'Prehliadka pred STK/EK');
    });

    it('should search by VIN', () => {
        cy.getByDataCy('query-search-field').type('vin0000000000001');

        cy.getByDataCy('search-result-list').should('be.visible');
        cy.getByDataCy('search-result-list-item').as('items').should('have.length', 3);
        cy.get('@items').first().find('[data-cy="search-result-item-content"]').as('first-item').should('be.visible');
        cy.get('@first-item').children().first().should('contain.text', 'AA001AA');
        cy.get('@first-item').children().first().should('contain.text', 'Zákazník:AlžbetaSokolová');
        cy.get('@first-item').children().first().should('contain.text', 'Stav odometra: 18 947km');
        cy.get('@first-item').children().first().should('contain.text', 'Počet príloh: 1ks');
        cy.get('@first-item').children().last().should('contain.text', 'Výmena filtrov');
    });

    it('should search by model and brand', () => {
        cy.getByDataCy('query-search-field').type('Super Vozidlo');

        cy.getByDataCy('search-result-list').should('be.visible');
        cy.getByDataCy('search-result-list-item').as('items').should('have.length', 3);
        cy.get('@items').first().find('[data-cy="search-result-item-content"]').as('first-item').should('be.visible');
        cy.get('@first-item').children().first().should('contain.text', 'AA001AA');
        cy.get('@first-item').children().first().should('contain.text', 'Zákazník:AlžbetaSokolová');
        cy.get('@first-item').children().first().should('contain.text', 'Stav odometra: 18 947km');
        cy.get('@first-item').children().first().should('contain.text', 'Počet príloh: 1ks');
        cy.get('@first-item').children().last().should('contain.text', 'Výmena filtrov');
    });

    it('should navigate to detail of record', () => {
        cy.contains('Výmena oleja').click();
        cy.location('pathname').should('eq', '/1'); // check for pathname to change
        cy.getByDataCy('log-title').contains('AA001AA-SuperVozidlo');
    });
});

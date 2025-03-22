describe('customers', () => {
    beforeEach(() => {
        cy.task('db:seed');
        cy.fixture('authentication').then((authentication) => {
            cy.directLogin(authentication.username, authentication.password);
        });
        cy.visit('/customer');
    });

    it('should have search field, action butttons and records visible', () => {
        cy.getByDataCy('query-search-field').should('be.visible');
        cy.getByDataCy('query-search-field-help').should('have.text', 'Vyhľadáva podľa mena, priezviska, telefónneho čísla a emailu.');
        cy.getByDataCy('query-search-field')
            .find('button')
            .should('have.attr', 'title')
            .and('match', /Vyhľadať/);
        cy.getByDataCy('add-customer-btn')
            .should('be.visible')
            .should('have.attr', 'title')
            .and('match', /Pridať zákaznika/);

        cy.getByDataCy('search-result-list').should('be.visible');
        cy.getByDataCy('search-result-list-item').as('items').should('have.length', 10);
        cy.get('@items').eq(2).find('[data-cy="search-result-item-content"]').as('third-item').should('be.visible');
        cy.getByDataCy('pagination').should('be.visible').find('li').should('have.length', 4);

        cy.get('@third-item').children().first().should('contain.text', 'DávidSuchý');
        cy.get('@third-item').children().last().should('contain.text', 'Telefón: 0900100102Email: david.suchy@email.test');
    });

    it('should navigate to second page', () => {
        cy.getByDataCy('pagination').find('[aria-label="Go to page 2"]').click();

        cy.getByDataCy('search-result-list').should('be.visible');
        cy.getByDataCy('search-result-list-item').as('items').should('have.length', 3);
        cy.get('@items').eq(2).find('[data-cy="search-result-item-content"]').as('third-item').should('be.visible');
        cy.get('@third-item').children().first().should('contain.text', 'Pavol');
        cy.get('@third-item').children().last().should('contain.text', 'Telefón: 0900001001');
    });

    it('should change page size', () => {
        cy.getByDataCy('page-size').click();
        cy.get('li[data-value="25"]').click();
        cy.getByDataCy('search-result-list-item').as('items').should('have.length', 13);
    });

    it('should search by name', () => {
        cy.getByDataCy('query-search-field').type('david');

        cy.getByDataCy('search-result-list').should('be.visible');
        cy.getByDataCy('search-result-list-item').as('items').should('have.length', 1);
        cy.get('@items').first().find('[data-cy="search-result-item-content"]').as('first-item').should('be.visible');
        cy.get('@first-item').children().first().should('contain.text', 'DávidSuchý');
        cy.get('@first-item').children().last().should('contain.text', 'Telefón: 0900100102Email: david.suchy@email.test');
    });

    it('should search by surname', () => {
        cy.getByDataCy('query-search-field').type('suchy');

        cy.getByDataCy('search-result-list').should('be.visible');
        cy.getByDataCy('search-result-list-item').as('items').should('have.length', 1);
        cy.get('@items').first().find('[data-cy="search-result-item-content"]').as('first-item').should('be.visible');
        cy.get('@first-item').children().first().should('contain.text', 'DávidSuchý');
        cy.get('@first-item').children().last().should('contain.text', 'Telefón: 0900100102Email: david.suchy@email.test');
    });

    it('should search by phone', () => {
        cy.getByDataCy('query-search-field').type('0900100102');

        cy.getByDataCy('search-result-list').should('be.visible');
        cy.getByDataCy('search-result-list-item').as('items').should('have.length', 1);
        cy.get('@items').first().find('[data-cy="search-result-item-content"]').as('first-item').should('be.visible');
        cy.get('@first-item').children().first().should('contain.text', 'DávidSuchý');
        cy.get('@first-item').children().last().should('contain.text', 'Telefón: 0900100102Email: david.suchy@email.test');
    });

    it('should search by email', () => {
        cy.getByDataCy('query-search-field').type('david.suchy@');

        cy.getByDataCy('search-result-list').should('be.visible');
        cy.getByDataCy('search-result-list-item').as('items').should('have.length', 1);
        cy.get('@items').first().find('[data-cy="search-result-item-content"]').as('first-item').should('be.visible');
        cy.get('@first-item').children().first().should('contain.text', 'DávidSuchý');
        cy.get('@first-item').children().last().should('contain.text', 'Telefón: 0900100102Email: david.suchy@email.test');
    });

    it('should create new customer with minimal data', () => {
        cy.visit('/customer/add');
        // Creates record with minimal data
        cy.getByDataCy('name-input').find('input').type('Testing');
        cy.getByDataCy('save-btn').click();
        // Check created record
        cy.location('pathname').should('eq', '/customer/14');
        cy.getByDataCy('customer-title').should('be.visible').should('have.text', 'Zákazník:Testing');
        cy.getByDataCy('name-input').find('input').should('have.value', 'Testing');
        cy.getByDataCy('back-btn').should('be.visible');
        cy.getByDataCy('edit-btn').should('be.visible');
    });

    it('should create new customer with full data', () => {
        cy.visit('/customer/add');
        // Creates record with minimal data
        cy.getByDataCy('name-input').find('input').type('Testing');
        cy.getByDataCy('surname-input').find('input').type('User');
        cy.getByDataCy('mobile-input').find('input').type('0000000000');
        cy.getByDataCy('email-input').find('input').type('mail@mail.test');
        cy.getByDataCy('save-btn').click();
        // Check created record
        cy.location('pathname').should('eq', '/customer/14');
        cy.getByDataCy('customer-title').should('be.visible').should('have.text', 'Zákazník:TestingUser');
        cy.getByDataCy('name-input').find('input').should('have.value', 'Testing');
        cy.getByDataCy('surname-input').find('input').should('have.value', 'User');
        cy.getByDataCy('mobile-input').find('input').should('have.value', '0000000000');
        cy.getByDataCy('email-input').find('input').should('have.value', 'mail@mail.test');
        cy.getByDataCy('back-btn').should('be.visible');
        cy.getByDataCy('edit-btn').should('be.visible');
    });

    it('should check for required and type validations', () => {
        cy.visit('/customer/add');
        cy.getByDataCy('save-btn').click();
        cy.getByDataCy('name-input').find('p').should('be.visible').should('have.text', 'Meno je požadované pole');
        cy.getByDataCy('save-btn').should('be.disabled');
        cy.getByDataCy('email-input').find('input').type('invalidmail');
        cy.getByDataCy('email-input').find('p').should('be.visible').should('have.text', 'Musí byť platný email');
    });

    it('should edit customer', () => {
        cy.visit('/customer/4');
        // Edit some data
        cy.getByDataCy('edit-btn').scrollIntoView().click();
        cy.getByDataCy('save-btn').should('be.visible');
        cy.getByDataCy('remove-btn').should('be.visible');
        cy.getByDataCy('cancel-btn').should('be.visible');
        cy.getByDataCy('name-input').find('input').type(' II');
        cy.getByDataCy('mobile-input').find('input').type('0000000000');
        cy.getByDataCy('email-input').find('input').type('mail@mail.test');
        // Save
        cy.getByDataCy('save-btn').scrollIntoView().click();
        // Check after save
        cy.getByDataCy('customer-title').should('be.visible').should('have.text', 'Zákazník:Alžbeta IISokolová');
        cy.getByDataCy('name-input').find('input').should('have.value', 'Alžbeta II');
        cy.getByDataCy('surname-input').find('input').should('have.value', 'Sokolová');
        cy.getByDataCy('mobile-input').find('input').should('have.value', '0000000000');
        cy.getByDataCy('email-input').find('input').should('have.value', 'mail@mail.test');
        cy.getByDataCy('edit-btn').should('be.visible');
        cy.getByDataCy('save-btn').should('not.exist');
        cy.getByDataCy('remove-btn').should('not.exist');
        cy.getByDataCy('cancel-btn').should('not.exist');
    });

    it('should delete customer', () => {
        cy.visit('/customer/4');
        cy.getByDataCy('edit-btn').scrollIntoView().click();
        cy.getByDataCy('remove-btn').scrollIntoView().click();
        cy.getByDataCy('modal-cancel-btn').click();
        cy.location('pathname').should('eq', '/customer/4');
        cy.getByDataCy('remove-btn').scrollIntoView().click();
        cy.getByDataCy('modal-remove-btn').click();
        cy.location('pathname').should('eq', '/customer');
    });
});

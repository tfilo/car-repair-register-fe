describe('vehicles', () => {
    beforeEach(() => {
        cy.task('db:seed');
        cy.fixture('authentication').then((authentication) => {
            cy.directLogin(authentication.username, authentication.password);
        });
        cy.visit('/vehicle');
    });

    it('should have search field, action butttons and records visible', () => {
        cy.getByDataCy('query-search-field').should('be.visible');
        cy.getByDataCy('query-search-field-help').should('have.text', 'Vyhľadáva podľa EČ, VIN, výrobcu, modelu a zákazníka.');
        cy.getByDataCy('query-search-field')
            .find('button')
            .should('have.attr', 'title')
            .and('match', /Vyhľadať/);
        cy.getByDataCy('add-vehicle-btn')
            .should('be.visible')
            .should('have.attr', 'title')
            .and('match', /Pridať vozidlo/);

        cy.getByDataCy('search-result-list').should('be.visible');
        cy.getByDataCy('search-result-list-item').as('items').should('have.length', 10);
        cy.get('@items').eq(2).find('[data-cy="search-result-item-content"]').as('third-item').should('be.visible');
        cy.getByDataCy('pagination').should('be.visible').find('li').should('have.length', 4);

        cy.get('@third-item').children().first().should('contain.text', 'AB000AA-NovéVozidlo');
        cy.get('@third-item').children().last().should('contain.text', 'VIN: VIN999999888Kód motora: KOD8988');
    });

    it('should navigate to second page', () => {
        cy.getByDataCy('pagination').find('[aria-label="Go to page 2"]').click();

        cy.getByDataCy('search-result-list').should('be.visible');
        cy.getByDataCy('search-result-list-item').as('items').should('have.length', 4);
        cy.get('@items').eq(3).find('[data-cy="search-result-item-content"]').as('fourth-item').should('be.visible');
        cy.get('@fourth-item').children().first().should('contain.text', 'BB987CCZákazník:Pavol');
    });

    it('should change page size', () => {
        cy.getByDataCy('page-size').click();
        cy.get('li[data-value="25"]').click();
        cy.getByDataCy('search-result-list-item').as('items').should('have.length', 14);
    });

    it('should search by name', () => {
        cy.getByDataCy('query-search-field').type('david');

        cy.getByDataCy('search-result-list').should('be.visible');
        cy.getByDataCy('search-result-list-item').as('items').should('have.length', 1);
        cy.get('@items').first().find('[data-cy="search-result-item-content"]').as('first-item').should('be.visible');
        cy.get('@first-item').children().first().should('contain.text', 'AC000AAZákazník:DávidSuchý');
    });

    it('should search by surname', () => {
        cy.getByDataCy('query-search-field').type('suchy');

        cy.getByDataCy('search-result-list').should('be.visible');
        cy.getByDataCy('search-result-list-item').as('items').should('have.length', 1);
        cy.get('@items').first().find('[data-cy="search-result-item-content"]').as('first-item').should('be.visible');
        cy.get('@first-item').children().first().should('contain.text', 'AC000AAZákazník:DávidSuchý');
    });

    it('should search by evidence number', () => {
        cy.getByDataCy('query-search-field').type('AC00');

        cy.getByDataCy('search-result-list').should('be.visible');
        cy.getByDataCy('search-result-list-item').as('items').should('have.length', 1);
        cy.get('@items').first().find('[data-cy="search-result-item-content"]').as('first-item').should('be.visible');
        cy.get('@first-item').children().first().should('contain.text', 'AC000AAZákazník:DávidSuchý');
    });

    it('should search by model', () => {
        cy.getByDataCy('query-search-field').type('vozid');

        cy.getByDataCy('search-result-list').should('be.visible');
        cy.getByDataCy('search-result-list-item').as('items').should('have.length', 2);
        cy.get('@items').first().find('[data-cy="search-result-item-content"]').as('first-item').should('be.visible');
        cy.get('@first-item').children().first().should('contain.text', 'AA001AA-SuperVozidlo');
    });

    it('should search by brand', () => {
        cy.getByDataCy('query-search-field').type('Super');

        cy.getByDataCy('search-result-list').should('be.visible');
        cy.getByDataCy('search-result-list-item').as('items').should('have.length', 1);
        cy.get('@items').first().find('[data-cy="search-result-item-content"]').as('first-item').should('be.visible');
        cy.get('@first-item').children().first().should('contain.text', 'AA001AA-SuperVozidlo');
    });

    it('should search by VIN', () => {
        cy.getByDataCy('query-search-field').type('VIN0000');

        cy.getByDataCy('search-result-list').should('be.visible');
        cy.getByDataCy('search-result-list-item').as('items').should('have.length', 1);
        cy.get('@items').first().find('[data-cy="search-result-item-content"]').as('first-item').should('be.visible');
        cy.get('@first-item').children().first().should('contain.text', 'AA001AA-SuperVozidlo');
    });

    it('should create new vehicle with minimal data', () => {
        cy.visit('/vehicle/add');
        // Creates record with minimal data
        cy.getByDataCy('customer-autocomplete').find('input').type('Ján horák');
        cy.get('li[role="option"]').eq(0).should('have.text', 'Ján Horák').click();
        cy.getByDataCy('registration-plate-input').find('input').type('BB000AA');
        cy.getByDataCy('save-btn').click();
        // Check created record
        cy.location('pathname').should('eq', '/vehicle/15');
        cy.getByDataCy('vehicle-title').should('be.visible').should('have.text', 'BB000AA');
        cy.getByDataCy('customer-autocomplete').find('input').should('have.value', 'Ján Horák');
        cy.getByDataCy('registration-plate-input').find('input').should('have.value', 'BB000AA');
        cy.getByDataCy('back-btn').should('be.visible');
        cy.getByDataCy('edit-btn').should('be.visible');
    });

    it('should create new vehicle with all data', () => {
        cy.visit('/vehicle/add');
        // Creates record with minimal data
        cy.getByDataCy('customer-autocomplete').find('input').type('Ján horák');
        cy.get('li[role="option"]').eq(0).should('have.text', 'Ján Horák').click();
        cy.getByDataCy('registration-plate-input').find('input').type('BB000AA');
        cy.getByDataCy('vin-input').find('input').type('VIN000011118888');
        cy.getByDataCy('engine-code-input').find('input').type('XZ118R');
        cy.getByDataCy('year-of-manufacture-input').find('input').type('2025');
        cy.getByDataCy('brand-input').find('input').type('Brand');
        cy.getByDataCy('model-input').find('input').type('Model');
        cy.getByDataCy('fuel-type-input').find('input').type('Gasoline');
        cy.getByDataCy('engine-power-input').find('input').type('89');
        cy.getByDataCy('engine-volume-input').find('input').type('1349');
        cy.getByDataCy('battery-capacity-input').find('input').type('20');
        cy.getByDataCy('save-btn').click();
        // Check created record
        cy.location('pathname').should('eq', '/vehicle/15');
        cy.getByDataCy('vehicle-title').should('be.visible').should('have.text', 'BB000AA');
        cy.getByDataCy('customer-autocomplete').find('input').should('have.value', 'Ján Horák');
        cy.getByDataCy('registration-plate-input').find('input').should('have.value', 'BB000AA');
        cy.getByDataCy('vin-input').find('input').should('have.value', 'VIN000011118888');
        cy.getByDataCy('engine-code-input').find('input').should('have.value', 'XZ118R');
        cy.getByDataCy('year-of-manufacture-input').find('input').should('have.value', '2025');
        cy.getByDataCy('brand-input').find('input').should('have.value', 'Brand');
        cy.getByDataCy('model-input').find('input').should('have.value', 'Model');
        cy.getByDataCy('fuel-type-input').find('input').should('have.value', 'Gasoline');
        cy.getByDataCy('engine-power-input').find('input').should('have.value', '89');
        cy.getByDataCy('engine-volume-input').find('input').should('have.value', '1349');
        cy.getByDataCy('battery-capacity-input').find('input').should('have.value', '20');
        cy.getByDataCy('back-btn').should('be.visible');
        cy.getByDataCy('edit-btn').should('be.visible');
    });

    it('should check for required and type validations', () => {
        cy.visit('/vehicle/add');
        cy.getByDataCy('save-btn').click();
        cy.getByDataCy('customer-autocomplete').find('p').should('be.visible').should('have.text', 'Zákazník je požadované pole');
        cy.getByDataCy('registration-plate-input').find('p').should('be.visible').should('have.text', 'EČ je požadované pole');
        cy.getByDataCy('save-btn').should('be.disabled');
        cy.getByDataCy('year-of-manufacture-input').find('input').type('not a number');
        cy.getByDataCy('year-of-manufacture-input').find('p').should('be.visible').should('have.text', 'Rok výroby musí byť číslo');
        cy.getByDataCy('engine-power-input').find('input').type('not a number');
        cy.getByDataCy('engine-power-input')
            .find('p')
            .should('be.visible')
            .should('have.text', 'Výkon motora musí byť číslo v jednotkách kW');
        cy.getByDataCy('engine-volume-input').find('input').type('not a number');
        cy.getByDataCy('engine-volume-input')
            .find('p')
            .should('be.visible')
            .should('have.text', 'Objem motora musí byť číslo v jednotkách ccm');
        cy.getByDataCy('battery-capacity-input').find('input').type('not a number');
        cy.getByDataCy('battery-capacity-input')
            .find('p')
            .should('be.visible')
            .should('have.text', 'Kapacita batérie musí byť číslo v jednotkách kWh');
    });

    it('should edit vehicle', () => {
        cy.visit('/vehicle/4');
        // Edit some data
        cy.getByDataCy('edit-btn').scrollIntoView().click();
        cy.getByDataCy('save-btn').should('be.visible');
        cy.getByDataCy('remove-btn').should('be.visible');
        cy.getByDataCy('cancel-btn').should('be.visible');
        cy.getByDataCy('registration-plate-input').find('input').clear().type(' XX111ZZ');
        cy.getByDataCy('year-of-manufacture-input').find('input').type('2020');
        cy.getByDataCy('engine-volume-input').find('input').type('1900');
        // Save
        cy.getByDataCy('save-btn').scrollIntoView().click();
        // Check after save
        cy.getByDataCy('vehicle-title').should('be.visible').should('have.text', 'XX111ZZ');
        cy.getByDataCy('registration-plate-input').find('input').should('have.value', 'XX111ZZ');
        cy.getByDataCy('year-of-manufacture-input').find('input').should('have.value', '2020');
        cy.getByDataCy('engine-volume-input').find('input').should('have.value', '1900');
        cy.getByDataCy('customer-autocomplete').find('input').should('have.value', 'Dávid Suchý');
        cy.getByDataCy('edit-btn').should('be.visible');
        cy.getByDataCy('save-btn').should('not.exist');
        cy.getByDataCy('remove-btn').should('not.exist');
        cy.getByDataCy('cancel-btn').should('not.exist');
    });

    it.only('should delete vehicle', () => {
        cy.visit('/vehicle/4');
        cy.getByDataCy('edit-btn').scrollIntoView().click();
        cy.getByDataCy('remove-btn').scrollIntoView().click();
        cy.getByDataCy('modal-cancel-btn').click();
        cy.location('pathname').should('eq', '/vehicle/4');
        cy.getByDataCy('remove-btn').scrollIntoView().click();
        cy.getByDataCy('modal-remove-btn').click();
        cy.location('pathname').should('eq', '/vehicle');
    });
});

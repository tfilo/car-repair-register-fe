import * as path from 'path';
import { addDays, format } from 'date-fns';

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

    it('should create new record for existing customer and vehicle with minimal data', () => {
        cy.visit('/add');
        // Creates record with minimal data
        cy.getByDataCy('log-title').should('be.visible');
        cy.getByDataCy('back-btn').should('be.visible');
        cy.getByDataCy('save-btn').should('be.visible');
        cy.getByDataCy('new-vehicle-checkbox').find('input').should('not.be.checked');
        cy.getByDataCy('new-customer-checkbox').find('input').should('not.be.checked');
        cy.getByDataCy('vehicle-autocomplete').find('input').type('Ján horák');
        cy.get('li[role="option"]').eq(0).should('have.text', 'AA002AA - Ján Horák').click();
        cy.getByDataCy('content-textarea').type('Toto je testovací popis opravy ktorý ma{enter}viacero riadkov');
        cy.getByDataCy('repair-date-input').find('input').type('01.03.2025');
        cy.getByDataCy('save-btn').click();
        // Check created record
        cy.location('pathname').should('eq', '/12');
        cy.getByDataCy('log-title').should('be.visible').should('have.text', 'AA002AA');
        cy.getByDataCy('vehicle-autocomplete').find('input').should('have.value', 'AA002AA - Ján Horák');
        cy.getByDataCy('content-textarea').should('have.value', 'Toto je testovací popis opravy ktorý ma\nviacero riadkov');
        cy.getByDataCy('repair-date-input').find('input').should('have.value', '01.03.2025');
        cy.getByDataCy('back-btn').should('be.visible');
        cy.getByDataCy('edit-btn').should('be.visible');
    });

    it('should create new record for existing customer and vehicle with all data', () => {
        cy.visit('/add');
        // Creates record with full data
        cy.getByDataCy('log-title').should('be.visible');
        cy.getByDataCy('back-btn').should('be.visible');
        cy.getByDataCy('save-btn').should('be.visible');
        cy.getByDataCy('new-vehicle-checkbox').find('input').should('not.be.checked');
        cy.getByDataCy('new-customer-checkbox').find('input').should('not.be.checked');
        cy.getByDataCy('vehicle-autocomplete').find('input').type('Ján horák');
        cy.get('li[role="option"]').eq(0).should('have.text', 'AA002AA - Ján Horák').click();
        cy.getByDataCy('content-textarea').type('Toto je testovací popis opravy ktorý ma{enter}viacero riadkov');
        cy.getByDataCy('odometer-input').find('input').type('89099');
        cy.getByDataCy('repair-date-input').find('input').type('01.03.2025');
        cy.getByDataCy('add-file-button').should('be.visible');
        cy.get('input[multiple][accept]').selectFile(['cypress/data/faktura.pdf', 'cypress/data/faktura.txt'], {
            force: true
        });
        cy.getByDataCy('download-faktura.pdf-file-name').scrollIntoView().should('be.visible').should('have.text', 'faktura.pdf');
        cy.getByDataCy('download-faktura.txt-file-name').scrollIntoView().should('be.visible').should('have.text', 'faktura.txt');
        cy.getByDataCy('download-faktura.pdf-file-size').scrollIntoView().should('be.visible').should('have.text', 'Veľkosť: 9.11 kB');
        cy.getByDataCy('download-faktura.txt-file-size').scrollIntoView().should('be.visible').should('have.text', 'Veľkosť: 54 B');
        cy.getByDataCy('remove-faktura.txt-file-button').click();
        cy.getByDataCy('download-faktura.txt-file-name').should('not.exist');
        cy.getByDataCy('download-faktura.txt-file-size').should('not.exist');
        cy.getByDataCy('remove-files-button').click();
        cy.getByDataCy('download-faktura.pdf-file-name').should('not.exist');
        cy.getByDataCy('download-faktura.pdf-file-size').should('not.exist');
        cy.get('input[multiple][accept]').selectFile(['cypress/data/faktura.pdf', 'cypress/data/faktura.txt'], {
            force: true
        });

        cy.getByDataCy('save-btn').click();
        // Check created record
        cy.location('pathname').should('eq', '/12');
        cy.getByDataCy('log-title').should('be.visible').should('have.text', 'AA002AA');
        cy.getByDataCy('vehicle-autocomplete').find('input').should('have.value', 'AA002AA - Ján Horák');
        cy.getByDataCy('content-textarea').should('have.value', 'Toto je testovací popis opravy ktorý ma\nviacero riadkov');
        cy.getByDataCy('odometer-input').find('input').should('have.value', '89099');
        cy.getByDataCy('repair-date-input').find('input').should('have.value', '01.03.2025');
        cy.getByDataCy('download-faktura.pdf-file-name').scrollIntoView().should('be.visible');
        cy.getByDataCy('download-faktura.txt-file-name').scrollIntoView().should('be.visible');

        const downloadsFolder = Cypress.config('downloadsFolder');
        cy.getByDataCy('download-faktura.txt-file-button').click();
        cy.readFile(path.join(downloadsFolder, 'faktura.txt')).should('exist');
        cy.getByDataCy('back-btn').should('be.visible');
        cy.getByDataCy('edit-btn').should('be.visible');
    });

    it('should create new record for existing customer and new vehicle with minimal data', () => {
        cy.visit('/add');
        // Creates record with minimal data
        cy.getByDataCy('log-title').should('be.visible');
        cy.getByDataCy('back-btn').should('be.visible');
        cy.getByDataCy('save-btn').should('be.visible');
        cy.getByDataCy('new-vehicle-checkbox').find('input').check();
        cy.getByDataCy('new-customer-checkbox').find('input').should('not.be.checked');
        cy.getByDataCy('customer-autocomplete').find('input').type('Ján horák');
        cy.get('li[role="option"]').eq(0).should('have.text', 'Ján Horák').click();
        cy.getByDataCy('registration-plate-input').find('input').type('BB000AA');
        cy.getByDataCy('content-textarea').type('Toto je testovací popis opravy ktorý ma{enter}viacero riadkov');
        cy.getByDataCy('repair-date-input').find('input').type('01.03.2025');
        cy.getByDataCy('save-btn').click();
        // Check created record
        cy.location('pathname').should('eq', '/12');
        cy.getByDataCy('log-title').should('be.visible').should('have.text', 'BB000AA');
        cy.getByDataCy('vehicle-autocomplete').find('input').should('have.value', 'BB000AA - Ján Horák');
        cy.getByDataCy('content-textarea').should('have.value', 'Toto je testovací popis opravy ktorý ma\nviacero riadkov');
        cy.getByDataCy('repair-date-input').find('input').should('have.value', '01.03.2025');
        cy.getByDataCy('back-btn').should('be.visible');
        cy.getByDataCy('edit-btn').should('be.visible');
    });

    it('should create new record for new customer and new vehicle with minimal data', () => {
        cy.visit('/add');
        // Creates record with minimal data
        cy.getByDataCy('log-title').should('be.visible');
        cy.getByDataCy('back-btn').should('be.visible');
        cy.getByDataCy('save-btn').should('be.visible');
        cy.getByDataCy('new-vehicle-checkbox').find('input').check();
        cy.getByDataCy('new-customer-checkbox').find('input').check();
        cy.getByDataCy('name-input').find('input').type('Test');
        cy.getByDataCy('surname-input').find('input').type('User');
        cy.getByDataCy('registration-plate-input').find('input').type('BB123AA');
        cy.getByDataCy('content-textarea').type('Toto je testovací popis opravy ktorý ma{enter}viacero riadkov');
        cy.getByDataCy('repair-date-input').find('input').type('01.03.2025');
        cy.getByDataCy('save-btn').click();
        // Check created record
        cy.location('pathname').should('eq', '/12');
        cy.getByDataCy('log-title').should('be.visible').should('have.text', 'BB123AA');
        cy.getByDataCy('vehicle-autocomplete').find('input').should('have.value', 'BB123AA - Test User');
        cy.getByDataCy('content-textarea').should('have.value', 'Toto je testovací popis opravy ktorý ma\nviacero riadkov');
        cy.getByDataCy('repair-date-input').find('input').should('have.value', '01.03.2025');
        cy.getByDataCy('back-btn').should('be.visible');
        cy.getByDataCy('edit-btn').should('be.visible');
    });

    it('should check for required and type validations', () => {
        cy.visit('/add');
        cy.getByDataCy('save-btn').click();
        cy.getByDataCy('vehicle-autocomplete').find('p').should('be.visible').should('have.text', 'Vozidlo je požadované pole');
        cy.getByDataCy('content-textarea').parent().find('p').should('be.visible').should('have.text', 'Popis opravy je požadované pole');
        cy.getByDataCy('repair-date-input').parent().find('p').should('be.visible').should('have.text', 'Dátum opravy je požadované pole');
        cy.getByDataCy('save-btn').should('be.disabled');
        cy.getByDataCy('odometer-input').find('input').type('AAAAA');
        cy.getByDataCy('odometer-input').find('p').should('be.visible').should('have.text', 'Stav odometra musí byť číslo v jednotkách km');
    });

    it('should check date must byt from past or present', () => {
        cy.visit('/add');
        cy.getByDataCy('vehicle-autocomplete').find('input').type('Ján horák');
        cy.get('li[role="option"]').eq(0).should('have.text', 'AA002AA - Ján Horák').click();
        cy.getByDataCy('content-textarea').type('Toto je testovací popis opravy ktorý ma{enter}viacero riadkov');
        cy.getByDataCy('repair-date-input').find('input').type(format(addDays(new Date(), 1), 'dd.MM.yyyy'));
        cy.getByDataCy('save-btn').click();
        cy.getByDataCy('repair-date-input').parent().find('.MuiFormHelperText-root.Mui-error').should('be.visible').should('have.text', 'Dátum opravy musí byť dnešný alebo z minulosti');
        cy.getByDataCy('save-btn').should('be.disabled');
        // check today
        cy.visit('/add');
        cy.getByDataCy('repair-date-input').find('input').type(format(new Date(), 'dd.MM.yyyy'));
        cy.getByDataCy('save-btn').click();
        cy.getByDataCy('save-btn').should('be.disabled');
        cy.getByDataCy('repair-date-input').parent().find('.MuiFormHelperText-root.Mui-error').should('not.exist');
        // check previouse
        cy.visit('/add');
        cy.getByDataCy('repair-date-input').find('input').type('01.01.2000');
        cy.getByDataCy('save-btn').click();
        cy.getByDataCy('save-btn').should('be.disabled');
        cy.getByDataCy('repair-date-input').parent().find('.MuiFormHelperText-root.Mui-error').should('not.exist');
    });

    it('should edit record', () => {
        cy.visit('/1');
        // Edit some data
        cy.getByDataCy('edit-btn').scrollIntoView().click();
        cy.getByDataCy('save-btn').should('be.visible');
        cy.getByDataCy('remove-btn').should('be.visible');
        cy.getByDataCy('cancel-btn').should('be.visible');
        cy.getByDataCy('vehicle-autocomplete').find('input').type('Ján horák');
        cy.get('li[role="option"]').eq(0).should('have.text', 'AA002AA - Ján Horák').click();
        cy.getByDataCy('odometer-input').find('input').clear().type('1111');
        cy.get('input[multiple][accept]').selectFile(['cypress/data/faktura.txt'], {
            force: true
        });
        // Save
        cy.getByDataCy('save-btn').scrollIntoView().click();
        // Check after save
        cy.getByDataCy('vehicle-autocomplete').find('input').should('have.value', 'AA002AA - Ján Horák');
        cy.getByDataCy('odometer-input').find('input').should('have.value', '1111');
        cy.getByDataCy('attachments-title').should('have.text', 'Prílohy: 3 ks');
        cy.getByDataCy('edit-btn').should('be.visible');
        cy.getByDataCy('save-btn').should('not.exist');
        cy.getByDataCy('remove-btn').should('not.exist');
        cy.getByDataCy('cancel-btn').should('not.exist');
    });

    it('should delete record', () => {
        cy.visit('/1');
        cy.getByDataCy('edit-btn').scrollIntoView().click();
        cy.getByDataCy('remove-btn').scrollIntoView().click();
        cy.getByDataCy('modal-cancel-btn').click();
        cy.location('pathname').should('eq', '/1');
        cy.getByDataCy('remove-btn').scrollIntoView().click();
        cy.getByDataCy('modal-remove-btn').click();
        cy.location('pathname').should('eq', '/');
    });
});

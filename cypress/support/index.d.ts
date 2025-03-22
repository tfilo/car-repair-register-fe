/// <reference types="cypress" />

import type Authentication from '../fixtures/auth.json';

interface FixtureTypes {
    authentication: typeof Authentication;
}

declare global {
    namespace Cypress {
        interface Chainable {
            /**
             * Log in by username and password using keycloak redirect, same way user will log in
             * @example cy.loginToKeycloak('user', 'password')
             */
            loginToKeycloak(username: string, password: string): Chainable<void>;
            /**
             * Log in by username and password by fetching token and setting it to session storage
             * @example cy.directLogin('user', 'password')
             */
            directLogin(username: string, password: string): Chainable<void>;
            /**
             * Get attribute by data-cy attribute value
             * @example cy.getByDataCy('value')
             */
            getByDataCy(value: string): Chainable<JQuery<HTMLElement>>;
            fixture<K extends keyof FixtureTypes>(fixture: K): Chainable<FixtureTypes[K]>;
        }
    }
}

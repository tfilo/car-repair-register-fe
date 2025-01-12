/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }

const loginToKeycloak = (username: string, password: string) => {
    Cypress.log({
        displayName: 'KEYCLOAK LOGIN',
        message: [`🔐 Authenticating | ${username}`],
        autoEnd: false
    });

    cy.visit('/');

    cy.origin(
        'http://localhost/auth/*',
        {
            args: {
                username,
                password
            }
        },
        ({ username, password }) => {
            cy.get('h1[id="kc-page-title"]').should('be.visible');
            cy.get('input[id="username"]:visible').type(username);
            cy.get('input[id="password"]:visible').type(password, {
                log: false
            });
            cy.get('button[type="submit"]:visible').click();
        }
    );
};

Cypress.Commands.addQuery('getByDataCy', function getByDataCy(value: string) {
    const getFn = cy.now('get', `[data-cy="${value}"`) as () => Promise<HTMLElement>;
    return () => {
        return getFn();
    };
});

Cypress.Commands.add('loginToKeycloak', (username: string, password: string) => {
    return loginToKeycloak(username, password);
});

declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace Cypress {
        interface Chainable {
            /**
             * Log in by username and password
             * @example cy.loginToKeycloak('user', 'password')
             */
            loginToKeycloak(username: string, password: string): Chainable<void>;
            /**
             * Get attribute by data-cy attribute value
             * @example cy.getByDataCy('value')
             */
            getByDataCy(value: string): Chainable<JQuery<HTMLElement>>;
        }
    }
}

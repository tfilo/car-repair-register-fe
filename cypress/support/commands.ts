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

    const baseUrl = Cypress.config().baseUrl;

    if (baseUrl !== null && (new URL(baseUrl).port === '80' || new URL(baseUrl).port.trim() === '')) {
        cy.get('h1[id="kc-page-title"]').should('be.visible');
        cy.get('input[id="username"]:visible').type(username);
        cy.get('input[id="password"]:visible').type(password, {
            log: false
        });
        cy.get('button[type="submit"]:visible').click();
    } else {
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
    }
};

const directLogin = (username: string, password: string) => {
    Cypress.log({
        displayName: 'DIRECT LOGIN',
        message: [`🔐 Authenticating | ${username}`],
        autoEnd: false
    });

    cy.request({
        method: 'POST',
        url: 'http://localhost/auth/realms/evidence/protocol/openid-connect/token',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `client_id=evidence-public&client_secret=&username=${username}&password=${password}&grant_type=password&scope=openid offline_access`
    })
        .its('body')
        .then((data) => {
            cy.visit('/', {
                onBeforeLoad(win) {
                    win.sessionStorage.setItem(`oidc.user:http://localhost/auth/realms/evidence:evidence-public`, JSON.stringify(data));
                }
            });
        });
};

Cypress.Commands.add('directLogin', (username: string, password: string) => {
    return directLogin(username, password);
});

Cypress.Commands.addQuery('getByDataCy', function getByDataCy(value: string) {
    const getFn = cy.now('get', `[data-cy="${value}"`) as () => Promise<HTMLElement>;
    return () => {
        return getFn();
    };
});

Cypress.Commands.add('loginToKeycloak', (username: string, password: string) => {
    return loginToKeycloak(username, password);
});

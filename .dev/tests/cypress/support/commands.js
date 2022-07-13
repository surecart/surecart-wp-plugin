import { disableGutenbergFeatures } from '../helpers';

import 'cypress-file-upload';

before(function () {
	disableGutenbergFeatures();

	// make sure to seed pages.
	cy.exec(
		`yarn wp-env run tests-cli "wp eval '\SureCart::page_seeder()->seed();'"`
	);
});

/**
 * Are we using live requests vs a fixture?
 */
const usingLiveRequests = () => {
	return Cypress.env('mockRequests') === false;
};

/**
 * Get a stripe payment element.
 *
 * @example cy.getStripeCardElement('number').type('4242424242424242');
 */
Cypress.Commands.add('getStripePaymentElement', (fieldName) => {
	if (Cypress.config('chromeWebSecurity')) {
		throw new Error(
			'To get stripe element `chromeWebSecurity` must be disabled'
		);
	}

	const selector = `input#Field-${fieldName}`;

	return cy
		.get('iframe')
		.its('0.contentDocument.body')
		.should('not.be.empty')
		.then(cy.wrap)
		.find(selector);
});

/**
 * Get a stripe card element.
 *
 * @example cy.getStripeCardElement('number').type('4242424242424242');
 */
Cypress.Commands.add('getStripeCardElement', (fieldName) => {
	if (Cypress.config('chromeWebSecurity')) {
		throw new Error(
			'To get stripe element `chromeWebSecurity` must be disabled'
		);
	}

	const selector = `.CardField-${fieldName} input:not([disabled])`;

	return cy
		.get('.StripeElement')
		.find('iframe')
		.its('0.contentDocument.body')
		.should('not.be.empty')
		.then(cy.wrap)
		.find(selector);
});

/**
 * Fetch nonce token.
 *
 * @example cy.nonce();
 */
Cypress.Commands.add('nonce', () => {
	return cy
		.request({
			method: 'GET',
			url: '/wp-admin/admin-ajax.php?action=sc-rest-nonce',
			log: false,
		})
		.its('body', { log: false });
});

/**
 * Login to WordPress if login cookie not present.
 */
Cypress.Commands.add('login', (username, password) => {
	cy.getCookies().then((cookies) => {
		let hasMatch = false;
		cookies.forEach((cookie) => {
			if (cookie.name.substr(0, 20) === 'wordpress_logged_in_') {
				hasMatch = true;
			}
		});
		if (!hasMatch) {
			cy.visit('/wp-login.php').wait(1000);
			cy.get('#user_login').type(username);
			cy.get('#user_pass').type(`${password}{enter}`);
		}
	});
});

/**
 * Intercept a request with a fixture file.
 */
Cypress.Commands.add(
	'interceptWithFixture',
	(method, url, { fixture, as = 'request', callback = null }) => {
		cy.fixture(fixture).then((body) => {
			if (callback) {
				body = callback(body);
			}
			if (usingLiveRequests()) {
				cy.intercept(method, url).as(as);
			} else {
				cy.intercept(method, url, body).as(as);
			}
		});
	}
);

/**
 * Update the fixture.
 */
Cypress.Commands.add('updateFixture', (fixture, content, json = true) => {
	if (!usingLiveRequests()) return;
	cy.writeFile(
		`.dev/tests/cypress/fixtures/${fixture}.json`,
		json ? JSON.stringify(content, null, 2) : content
	);
});

// Custom uploadFile command
Cypress.Commands.add('uploadFile', (fileName, fileType, selector) => {
	cy.get(selector).then((subject) => {
		cy.fixture(fileName, 'hex').then((fileHex) => {
			const fileBytes = hexStringToByte(fileHex);
			const testFile = new File([fileBytes], fileName, {
				type: fileType,
			});
			const dataTransfer = new DataTransfer();
			const el = subject[0];

			dataTransfer.items.add(testFile);
			el.files = dataTransfer.files;
		});
	});
});

// Utilities
function hexStringToByte(str) {
	if (!str) {
		return new Uint8Array();
	}

	const a = [];
	for (let i = 0, len = str.length; i < len; i += 2) {
		a.push(parseInt(str.substr(i, 2), 16));
	}

	return new Uint8Array(a);
}

/**
 * Starting in Cypress 8.1.0 Unhandled Exceptions now cause tests to fail.
 * Sometimes unhandled exceptions occur in Core that do not effect the UX created by CoBlocks.
 * We discard unhandled exceptions and pass the test as long as assertions continue expectedly.
 */
Cypress.on('uncaught:exception', () => {
	// returning false here prevents Cypress from failing the test.
	return false;
});

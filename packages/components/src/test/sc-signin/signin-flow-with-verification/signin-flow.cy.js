describe('Signin', () => {

	it('Show signin form', () => {
		cy.clearLocalStorage();


		cy.visit('/test/sc-signin/signin-flow-with-verification');
		cy.get('sc-login-form').contains('Test');
	});

	it('Check email success', () => {
		cy.intercept(
		  {
			method: 'POST',
			path: '**/surecart/v1/check_email*',
		  },
		  {
			'check_email': true
		  },
		).as('checkEmailSuccess');
	
		cy.visit('/test/sc-signin/signin-flow-with-verification');
		cy.get('sc-form-control').find('input').type('alamgirh@bsf.io', { force: true });
		cy.get('sc-button').shadow().find('.button').should('not.have.class', 'button--loading').click({ force: true, waitForAnimations: true, multiple: true });
		cy.wait('@checkEmailSuccess');
		cy.get('sc-login-form').contains('Enter your password');
	});

	it('Send verification code', () => {
		cy.intercept(
			{
			  method: 'POST',
			  path: '**/surecart/v1/verification_codes*',
			},
			{
				"id": "5f3adc72-260d-4c31-a08c-e778ea5fca97",
				"object": "verification_code",
				"email": "test-1@example.com",
				"verified": true,
			},
		).as('sendVerificationCode');
	
		cy.get('sc-button').shadow().find('.button').should('not.have.class', 'button--loading').first().click({ force: true, waitForAnimations: true, multiple: true });
		cy.wait('@sendVerificationCode');
		cy.get('sc-login-form').contains('Sent!');
	});
});

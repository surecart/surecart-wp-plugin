describe('Signin', () => {
  it('Check email error', () => {
		cy.intercept(
		  {
			method: 'POST',
			path: '**/surecart/v1/check_email*',
		  },
		  {
        statusCode: 404,
        body: {
          message: 'Error',
          additional_errors: [
            {message: 'This is an additional error.'}
          ]
        },
		  },
		).as('checkEmailError');

		cy.visit('/test/sc-login-form');
		cy.get('sc-form-control').find('input').type('alamgirh@bsf.io', { force: true });
		cy.get('sc-button').shadow().find('.button').should('not.have.class', 'button--loading').click({ force: true, waitForAnimations: true, multiple: true });
		cy.wait('@checkEmailError');
		cy.get('sc-login-form').contains('Error');
    cy.get('sc-login-form').contains('This is an additional error.');
	});

	it('Successful flow', () => {
		cy.intercept(
		  {
			method: 'POST',
			path: '**/surecart/v1/check_email*',
		  },
		  {
			'check_email': true
		  },
		).as('checkEmailSuccess');

		cy.visit('/test/sc-login-form');
    cy.get('sc-login-form').contains('Test');
		cy.get('sc-form-control').find('input').type('alamgirh@bsf.io', { force: true });
		cy.get('sc-button').shadow().find('.button').should('not.have.class', 'button--loading').click({ force: true, waitForAnimations: true, multiple: true });
		cy.wait('@checkEmailSuccess');
		cy.get('sc-login-form').contains('Enter your password');

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
		cy.get('sc-login-form').contains('Check your email');

    cy.intercept(
			{
			  method: 'POST',
			  path: '**/surecart/v1/verification_codes/verify*',
			},
			{
				"id": "5f3adc72-260d-4c31-a08c-e778ea5fca97",
				"object": "verification_code",
				"email": "test-1@example.com",
				"verified": true,
			},
		).as('verify');

    cy.get('sc-form-control').find('input').type('123456', { force: true });
    cy.wait('@verify');
    cy.get('sc-login-form').contains('Test');
	});
});

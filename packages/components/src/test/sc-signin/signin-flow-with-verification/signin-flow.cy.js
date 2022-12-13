describe('Signin', () => {

	it('Signin ', () => {
		cy.clearLocalStorage();


		cy.visit('/test/sc-signin/signin-flow-with-verification');
		cy.get('sc-login-form').contains('Test');
		cy.get('sc-form-control').find('input').type('alamgir@bsf.io', { force: true });

		cy.get('sc-button').shadow().find('.button').should('not.have.class', 'button--loading').click({ force: true, waitForAnimations: true, multiple: true });
    });
});

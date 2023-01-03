describe('Cancel Dialog (basic) ', () => {
  it('Preserves with discount', () => {
    cy.intercept('**/surecart/v1/cancellation_reasons*', [{
      id: 'comment_reason_id',
      "comment_enabled": true,
      "comment_prompt": 'prompt',
      "coupon_enabled": true,
      "label": "Coupon comment",
    }, {
      "comment_enabled": false,
      "comment_prompt": null,
      "coupon_enabled": false,
      "label": "Non coupon",
    }]).as('getReasons');

    cy.visit('/test/sc-cancel-dialog/insights');
    cy.get('sc-cancel-dialog').find('sc-cancel-survey').find('sc-dashboard-module').as('surveyContent');

    // locales.
    cy.get('@surveyContent').find("[part=base]").should('contain', "We're sad to see you go");
    cy.get('@surveyContent').should('contain', "Before you cancel, please let us know the reason you're leaving.");

    // make choice and fill textarea.
    cy.get('@surveyContent').find('sc-choice').first().find('input').click({force: true});
    cy.get('@surveyContent').find('sc-textarea').find('textarea').type('This is prompt text', { force: true });

    // submit.
    cy.get('@surveyContent').find('sc-button[type=primary]')
    .find('.button')
    .click({force: true});

    cy.get('sc-cancel-dialog').find('sc-cancel-discount').find('sc-dashboard-module').as('discountContent');
    cy.get('@discountContent').find("[part=base]").should('contain', "$5.00 off");
    cy.get('@discountContent').should('contain', "$5.00 off");

    cy.intercept('**//surecart/v1/subscriptions/subscription_id/preserve*', {}).as('preserve');

    cy.get('@discountContent').find('sc-button[type=primary]')
    .find('.button')
    .click({force: true});

    cy.wait('@preserve').its('request.url')
      .should('include', 'cancellation_act%5Bcomment%5D=This%20is%20prompt%20text')
      .should('include','cancellation_act%5Bcancellation_reason_id%5D=comment_reason_id')

      cy.get('@discountContent').find('.cancel-discount__abort-link')
      .find('.button')
      .click({force: true});

      cy.get('sc-cancel-dialog').find('sc-subscription-cancel').should('be.visible');
  });

  it('Cancels with reason', () => {
    cy.intercept('**/surecart/v1/cancellation_reasons*', [ {
      id: 'comment_reason_id',
      "comment_enabled":true,
      "comment_prompt": 'Prompt',
      "coupon_enabled": false,
      "label": "Non coupon",
    }]).as('getReasons');

    cy.visit('/test/sc-cancel-dialog/insights');
    cy.get('sc-cancel-dialog').find('sc-cancel-survey').find('sc-dashboard-module').as('surveyContent');

    // locales.
    cy.get('@surveyContent').find("[part=base]").should('contain', "We're sad to see you go");
    cy.get('@surveyContent').should('contain', "Before you cancel, please let us know the reason you're leaving.");

    // make choice.
    cy.get('@surveyContent').find('sc-choice').first().find('input').click({force: true});
    cy.get('@surveyContent').find('sc-textarea').find('textarea').type('This is prompt text', { force: true });

    // submit.
    cy.get('@surveyContent').find('sc-button[type=primary]')
    .find('.button')
    .click({force: true});

    cy.intercept('**//surecart/v1/subscriptions/subscription_id/cancel*', {
      id: 'test'
    }).as('cancel');

    cy.get('sc-cancel-dialog').find('sc-subscription-cancel').as('cancelContent').should('be.visible');
    cy.get('@cancelContent').find('sc-dashboard-module').find('sc-button[type=primary]')
    .find('.button')
    .click({force: true});

    cy.wait('@cancel').its('request.url')
    .should('include', 'cancellation_act%5Bcomment%5D=This%20is%20prompt%20text')
    .should('include','cancellation_act%5Bcancellation_reason_id%5D=comment_reason_id')
  })
});

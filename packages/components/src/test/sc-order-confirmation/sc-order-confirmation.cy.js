describe('Order Confirmation', () => {
  it('Shows an empty message', () => {
    cy.visit('/test/sc-order-confirmation/');
    cy.get('sc-order-confirmation').shadow().find('sc-heading').contains('Order not found.');
  });
  it('Shows an error message', () => {
    cy.visit('/test/sc-order-confirmation/?order=test');
    cy.get('sc-order-confirmation').shadow().find('sc-heading').contains('Order not found.');
  });
  it('Shows an order', () => {
    cy.intercept(
      {
        path: '**/surecart/v1/checkouts/*',
      },
      {
        id: 'test',
        object: 'checkout',
        status: 'paid',
        amount_due: 2000,
        subtotal_amount: 2000,
        total_amount: 3000,
        currency: 'usd',
        line_items: {
          data: [
            {
              id: 'test_line_item',
              amount: 2000,
              price: {
                id: 'test_price_id',
                amount: 2000,
                currency: 'usd',
                product: {
                  id: 'product_id',
                  name: 'Test Product',
                },
              },
            },
          ],
        },
      },
    ).as('checkout');

    cy.visit('/test/sc-order-confirmation/?order=test');
    cy.wait('@checkout');
    cy.get('sc-order-confirmation-line-items').shadow().find('sc-product-line-item').shadow().find('[part=base]').contains('Test Product');
  });
});

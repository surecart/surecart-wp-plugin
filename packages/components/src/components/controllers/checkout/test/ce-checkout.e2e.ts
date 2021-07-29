import { newE2EPage } from '@stencil/core/testing';
import { setResponses } from '../../../../testing';
import prices from '../../../../testing/fixtures/prices';
import session from '../../../../testing/fixtures/session';

describe('ce-checkout', () => {
  const setRequests = async page => {
    await page.setRequestInterception(true);
    setResponses(
      [
        {
          path: '/price/',
          data: {
            body: JSON.stringify(prices),
          },
        },
        {
          path: '/checkout_sessions',
          data: {
            body: JSON.stringify(session),
          },
        },
      ],
      page,
    );
  };

  it('renders', async () => {
    const page = await newE2EPage();
    await setRequests(page);
    await page.setContent('<ce-checkout></ce-checkout>');
    const element = await page.find('ce-checkout');
    expect(element).toHaveClass('hydrated');
  });

  // it('fetches prices', async () => {
  //   const page = await newE2EPage();
  //   await setRequests(page);

  //   await page.setContent('<ce-checkout><ce-price-choices></ce-price-choices></ce-checkout>');
  //   const element = await page.find('ce-checkout');
  //   const prices = await page.find('ce-price-choices');
  //   prices.setProperty('priceIds', ['1', '2', '3']);
  //   await page.waitForChanges();

  //   // should only have 2 since euros should not be part of it.
  //   const choice = await page.$$('ce-choice');
  //   expect(choice).toHaveLength(2);
  // });

  it('Creates a session', async () => {
    const page = await newE2EPage();
    await setRequests(page);

    await page.setContent(`
    <ce-checkout>
      <ce-price-choices></ce-price-choices>
      <ce-order-summary>
        <ce-line-items></ce-line-items>
        <ce-total class="ce-subtotal" total="subtotal"></ce-total>
        <ce-total class="ce-total" total="total"></ce-total>
      </ce-order-summary>
    </ce-checkout>
    `);
    await page.find('ce-checkout');
    await page.waitForChanges();

    // has total
    const subtotal = await page.find('.ce-subtotal >>> ce-line-item >>> .item__price');
    expect(subtotal).toEqualText('$29.00');

    // has subtotal
    const total = await page.find('.ce-total >>> ce-line-item >>> .item__price');
    expect(total).toEqualText('$28.00');
  });
});

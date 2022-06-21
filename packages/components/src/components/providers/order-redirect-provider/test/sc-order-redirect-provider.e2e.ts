import { newE2EPage } from '@stencil/core/testing';

describe('sc-order-redirect-provider', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<sc-order-redirect-provider></sc-order-redirect-provider>');

    const element = await page.find('sc-order-redirect-provider');
    expect(element).toHaveClass('hydrated');
  });

  it('triggers a form state event if and redirects if paid', async () => {
    const page = await newE2EPage();
    await page.setContent('<sc-order-redirect-provider></sc-order-redirect-provider>');

    // events to spy on.
    const scSetState = await page.spyOnEvent('scSetState');
    await page.$eval('sc-order-redirect-provider', (elm: HTMLScOrderRedirectProviderElement) => {
      elm.order = { status: 'paid' };
    });

    page.waitForChanges();
    expect(scSetState).toHaveReceivedEventDetail('PAID');
  });
});

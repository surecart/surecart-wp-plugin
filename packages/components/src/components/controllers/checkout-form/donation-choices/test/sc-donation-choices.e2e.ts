import { newE2EPage } from '@stencil/core/testing';
import { LineItem, Price } from '../../../../../types';

describe('sc-donation-choices', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<sc-donation-choices></sc-donation-choices>');

    const element = await page.find('sc-donation-choices');
    expect(element).toHaveClass('hydrated');
  });

  it('only renders price selections within maximum and minimum', async () => {
    const page = await newE2EPage();
    await page.setContent(`<sc-donation-choices price-id="test_price">
    <sc-choice value="100">$1</sc-choice>
    <sc-choice value="500">$5</sc-choice>
    <sc-choice value="1000">$10</sc-choice>
    <sc-choice value="1500">$15</sc-choice>
    <sc-choice value="ad_hoc">Other</sc-choice>
    </sc-donation-choices>`);

    const element = await page.find('sc-donation-choices');
    element.setProperty('lineItems', [
      {
        id: 'line',
        ad_hoc_amount: 1000,
        price: {
          id: 'test_price',
          ad_hoc_min_amount: 500,
          ad_hoc_max_amount: 1000,
        } as Price,
      } as LineItem,
    ]);
    await page.waitForChanges();

    const lower = await page.find('sc-choice[value="100"]');
    expect(lower).toHaveAttribute('disabled');
    expect(await lower.isVisible()).toBe(false);
    const higher = await page.find('sc-choice[value="1500"]');
    expect(higher).toHaveAttribute('disabled');
    expect(await higher.isVisible()).toBe(false);

    element.setProperty('lineItems', [
      {
        id: 'line',
        ad_hoc_amount: 1000,
        price: {
          id: 'test_price',
          ad_hoc_min_amount: 500,
          ad_hoc_max_amount: null,
        } as Price,
      } as LineItem,
    ]);
    await page.waitForChanges();

    expect(lower).toHaveAttribute('disabled');
    expect(await lower.isVisible()).toBe(false);
    expect(higher).not.toHaveAttribute('disabled');
    expect(await higher.isVisible()).toBe(true);

    element.setProperty('lineItems', [
      {
        id: 'line',
        ad_hoc_amount: 1000,
        price: {
          id: 'test_price',
          ad_hoc_min_amount: null,
          ad_hoc_max_amount: null,
        } as Price,
      } as LineItem,
    ]);
    await page.waitForChanges();

    expect(lower).not.toHaveAttribute('disabled');
    expect(await lower.isVisible()).toBe(true);
    expect(higher).not.toHaveAttribute('disabled');
    expect(await higher.isVisible()).toBe(true);
  });
});

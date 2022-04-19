import { newE2EPage } from '@stencil/core/testing';

describe('sc-toggles', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<sc-toggles></sc-toggles>');

    const element = await page.find('sc-toggles');
    expect(element).toHaveClass('hydrated');
  });
});

import { newE2EPage } from '@stencil/core/testing';

describe('sc-alert', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<sc-alert></sc-alert>');

    const element = await page.find('sc-alert');
    expect(element).toHaveClass('hydrated');
  });
});

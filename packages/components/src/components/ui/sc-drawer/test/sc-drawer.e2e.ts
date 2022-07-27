import { newE2EPage } from '@stencil/core/testing';

describe('sc-drawer', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<sc-drawer></sc-drawer>');

    const element = await page.find('sc-drawer');
    expect(element).toHaveClass('hydrated');
  });
});

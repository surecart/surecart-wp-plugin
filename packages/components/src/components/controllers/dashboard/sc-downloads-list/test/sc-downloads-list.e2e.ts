import { newE2EPage } from '@stencil/core/testing';

describe('sc-downloads-list', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<sc-downloads-list></sc-downloads-list>');

    const element = await page.find('sc-downloads-list');
    expect(element).toHaveClass('hydrated');
  });
});

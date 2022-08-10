import { newE2EPage } from '@stencil/core/testing';

describe('sc-licenses-list', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<sc-licenses-list></sc-licenses-list>');

    const element = await page.find('sc-licenses-list');
    expect(element).toHaveClass('hydrated');
  });
});

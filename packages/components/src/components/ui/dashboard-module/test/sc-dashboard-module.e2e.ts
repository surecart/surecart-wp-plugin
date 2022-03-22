import { newE2EPage } from '@stencil/core/testing';

describe('sc-dashboard-module', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<sc-dashboard-module></sc-dashboard-module>');

    const element = await page.find('sc-dashboard-module');
    expect(element).toHaveClass('hydrated');
  });
});

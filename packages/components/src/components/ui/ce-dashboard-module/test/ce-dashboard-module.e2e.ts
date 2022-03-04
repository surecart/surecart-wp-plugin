import { newE2EPage } from '@stencil/core/testing';

describe('ce-dashboard-module', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<ce-dashboard-module></ce-dashboard-module>');

    const element = await page.find('ce-dashboard-module');
    expect(element).toHaveClass('hydrated');
  });
});

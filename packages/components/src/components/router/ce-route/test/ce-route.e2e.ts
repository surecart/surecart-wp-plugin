import { newE2EPage } from '@stencil/core/testing';

describe('ce-route', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<ce-route></ce-route>');

    const element = await page.find('ce-route');
    expect(element).toHaveClass('hydrated');
  });
});

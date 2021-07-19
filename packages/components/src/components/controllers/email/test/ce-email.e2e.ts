import { newE2EPage } from '@stencil/core/testing';

describe('ce-email', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<ce-email></ce-email>');

    const element = await page.find('ce-email');
    expect(element).toHaveClass('hydrated');
  });
});

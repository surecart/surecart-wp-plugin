import { newE2EPage } from '@stencil/core/testing';

describe('ce-heading', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<ce-heading></ce-heading>');

    const element = await page.find('ce-heading');
    expect(element).toHaveClass('hydrated');
  });
});

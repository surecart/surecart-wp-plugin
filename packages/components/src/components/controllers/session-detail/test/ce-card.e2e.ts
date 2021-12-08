import { newE2EPage } from '@stencil/core/testing';

describe('ce-card', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<ce-card></ce-card>');

    const element = await page.find('ce-card');
    expect(element).toHaveClass('hydrated');
  });
});

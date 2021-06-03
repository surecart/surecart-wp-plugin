import { newE2EPage } from '@stencil/core/testing';

describe('ce-divider', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<ce-divider></ce-divider>');

    const element = await page.find('ce-divider');
    expect(element).toHaveClass('hydrated');
  });
});

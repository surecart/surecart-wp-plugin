import { newE2EPage } from '@stencil/core/testing';

describe('ce-section-title', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<ce-section-title></ce-section-title>');

    const element = await page.find('ce-section-title');
    expect(element).toHaveClass('hydrated');
  });
});

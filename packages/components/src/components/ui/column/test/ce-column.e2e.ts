import { newE2EPage } from '@stencil/core/testing';

describe('ce-column', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<ce-column></ce-column>');

    const element = await page.find('ce-column');
    expect(element).toHaveClass('hydrated');
  });
});

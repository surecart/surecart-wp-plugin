import { newE2EPage } from '@stencil/core/testing';

describe('ce-pagination', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<ce-pagination></ce-pagination>');

    const element = await page.find('ce-pagination');
    expect(element).toHaveClass('hydrated');
  });
});

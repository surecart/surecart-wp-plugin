import { newE2EPage } from '@stencil/core/testing';

describe('ce-total', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<ce-total></ce-total>');

    const element = await page.find('ce-total');
    expect(element).toHaveClass('hydrated');
  });
});

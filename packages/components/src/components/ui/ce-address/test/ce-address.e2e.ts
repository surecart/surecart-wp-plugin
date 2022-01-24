import { newE2EPage } from '@stencil/core/testing';

describe('ce-address', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<ce-address></ce-address>');

    const element = await page.find('ce-address');
    expect(element).toHaveClass('hydrated');
  });
});

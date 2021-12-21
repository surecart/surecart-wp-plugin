import { newE2EPage } from '@stencil/core/testing';

describe('ce-flex', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<ce-flex></ce-flex>');

    const element = await page.find('ce-flex');
    expect(element).toHaveClass('hydrated');
  });
});

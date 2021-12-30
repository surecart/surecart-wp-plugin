import { newE2EPage } from '@stencil/core/testing';

describe('ce-router', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<ce-router></ce-router>');

    const element = await page.find('ce-router');
    expect(element).toHaveClass('hydrated');
  });
});

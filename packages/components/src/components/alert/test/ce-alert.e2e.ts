import { newE2EPage } from '@stencil/core/testing';

describe('ce-alert', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<ce-alert></ce-alert>');

    const element = await page.find('ce-alert');
    expect(element).toHaveClass('hydrated');
  });
});

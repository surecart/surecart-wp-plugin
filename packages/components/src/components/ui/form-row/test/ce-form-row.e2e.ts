import { newE2EPage } from '@stencil/core/testing';

describe('ce-form-row', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<ce-form-row></ce-form-row>');

    const element = await page.find('ce-form-row');
    expect(element).toHaveClass('hydrated');
  });
});

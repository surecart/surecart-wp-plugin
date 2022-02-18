import { newE2EPage } from '@stencil/core/testing';

describe('ce-form-components-validator', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<ce-form-components-validator></ce-form-components-validator>');

    const element = await page.find('ce-form-components-validator');
    expect(element).toHaveClass('hydrated');
  });
});

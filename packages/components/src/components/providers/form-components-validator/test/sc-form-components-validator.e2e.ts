import { newE2EPage } from '@stencil/core/testing';

describe('sc-form-components-validator', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<sc-form-components-validator></sc-form-components-validator>');

    const element = await page.find('sc-form-components-validator');
    expect(element).toHaveClass('hydrated');
  });
});

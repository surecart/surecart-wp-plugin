import { newE2EPage } from '@stencil/core/testing';

describe('sc-form-row', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<sc-form-row></sc-form-row>');

    const element = await page.find('sc-form-row');
    expect(element).toHaveClass('hydrated');
  });
});

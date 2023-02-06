import { newE2EPage } from '@stencil/core/testing';

describe('sc-conditional-form', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<sc-conditional-form></sc-conditional-form>');

    const element = await page.find('sc-conditional-form');
    expect(element).toHaveClass('hydrated');
  });
});

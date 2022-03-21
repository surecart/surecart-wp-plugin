import { newE2EPage } from '@stencil/core/testing';

describe('sc-spacing', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<sc-spacing></sc-spacing>');

    const element = await page.find('sc-spacing');
    expect(element).toHaveClass('hydrated');
  });
});

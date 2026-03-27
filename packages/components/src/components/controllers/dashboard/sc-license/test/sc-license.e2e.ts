import { newE2EPage } from '@stencil/core/testing';

describe('sc-license', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<sc-license></sc-license>');

    const element = await page.find('sc-license');
    expect(element).toHaveClass('hydrated');
  });
});

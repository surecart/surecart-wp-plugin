import { newE2EPage } from '@stencil/core/testing';

describe('sc-prose', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<sc-prose></sc-prose>');

    const element = await page.find('sc-prose');
    expect(element).toHaveClass('hydrated');
  });
});

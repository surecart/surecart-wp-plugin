import { newE2EPage } from '@stencil/core/testing';

describe('sc-image-slider', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<sc-image-slider></sc-image-slider>');

    const element = await page.find('sc-image-slider');
    expect(element).toHaveClass('hydrated');
  });
});

import { newE2EPage } from '@stencil/core/testing';

describe('sc-column', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<sc-column></sc-column>');

    const element = await page.find('sc-column');
    expect(element).toHaveClass('hydrated');
  });
});

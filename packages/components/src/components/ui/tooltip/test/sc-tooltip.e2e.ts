import { newE2EPage } from '@stencil/core/testing';

describe('sc-tooltip', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<sc-tooltip></sc-tooltip>');

    const element = await page.find('sc-tooltip');
    expect(element).toHaveClass('hydrated');
  });
});

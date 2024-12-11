import { newE2EPage } from '@stencil/core/testing';

describe('sc-line-item-trial', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<sc-line-item-trial></sc-line-item-trial>');

    const element = await page.find('sc-line-item-trial');
    expect(element).toHaveClass('hydrated');
  });
});

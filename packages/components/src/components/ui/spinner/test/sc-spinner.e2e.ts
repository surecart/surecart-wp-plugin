import { newE2EPage } from '@stencil/core/testing';

describe('sc-spinner', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<sc-spinner></sc-spinner>');

    const element = await page.find('sc-spinner');
    expect(element).toHaveClass('hydrated');
  });
});

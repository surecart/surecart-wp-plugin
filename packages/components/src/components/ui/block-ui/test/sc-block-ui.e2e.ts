import { newE2EPage } from '@stencil/core/testing';

describe('sc-block-ui', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<sc-block-ui></sc-block-ui>');

    const element = await page.find('sc-block-ui');
    expect(element).toHaveClass('hydrated');
  });
});

import { newE2EPage } from '@stencil/core/testing';

describe('sc-empty', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<sc-empty></sc-empty>');

    const element = await page.find('sc-empty');
    expect(element).toHaveClass('hydrated');
  });
});

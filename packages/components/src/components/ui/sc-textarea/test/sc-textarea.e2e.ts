import { newE2EPage } from '@stencil/core/testing';

describe('sc-textarea', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<sc-textarea></sc-textarea>');

    const element = await page.find('sc-textarea');
    expect(element).toHaveClass('hydrated');
  });
});

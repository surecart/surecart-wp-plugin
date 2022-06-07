import { newE2EPage } from '@stencil/core/testing';

describe('sc-dialog', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<sc-dialog></sc-dialog>');

    const element = await page.find('sc-dialog');
    expect(element).toHaveClass('hydrated');
  });
});

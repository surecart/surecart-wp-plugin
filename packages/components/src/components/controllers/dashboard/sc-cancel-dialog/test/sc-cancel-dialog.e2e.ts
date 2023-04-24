import { newE2EPage } from '@stencil/core/testing';

describe('sc-cancel-dialog', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<sc-cancel-dialog></sc-cancel-dialog>');

    const element = await page.find('sc-cancel-dialog');
    expect(element).toHaveClass('hydrated');
  });
});

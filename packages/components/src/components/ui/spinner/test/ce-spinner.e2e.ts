import { newE2EPage } from '@stencil/core/testing';

describe('ce-spinner', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<ce-spinner></ce-spinner>');

    const element = await page.find('ce-spinner');
    expect(element).toHaveClass('hydrated');
  });
});

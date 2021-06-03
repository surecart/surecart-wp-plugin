import { newE2EPage } from '@stencil/core/testing';

describe('ce-skeleton', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<ce-skeleton></ce-skeleton>');

    const element = await page.find('ce-skeleton');
    expect(element).toHaveClass('hydrated');
  });
});

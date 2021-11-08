import { newE2EPage } from '@stencil/core/testing';

describe('ce-line-items-provider', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<ce-line-items-provider></ce-line-items-provider>');

    const element = await page.find('ce-line-items-provider');
    expect(element).toHaveClass('hydrated');
  });
});

import { newE2EPage } from '@stencil/core/testing';

describe('ce-block-ui', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<ce-block-ui></ce-block-ui>');

    const element = await page.find('ce-block-ui');
    expect(element).toHaveClass('hydrated');
  });
});

import { newE2EPage } from '@stencil/core/testing';

describe('ce-tag', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<ce-tag></ce-tag>');

    const element = await page.find('ce-tag');
    expect(element).toHaveClass('hydrated');
  });
});

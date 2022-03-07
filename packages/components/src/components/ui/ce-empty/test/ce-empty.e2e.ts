import { newE2EPage } from '@stencil/core/testing';

describe('ce-empty', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<ce-empty></ce-empty>');

    const element = await page.find('ce-empty');
    expect(element).toHaveClass('hydrated');
  });
});

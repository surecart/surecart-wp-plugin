import { newE2EPage } from '@stencil/core/testing';

describe('ce-tab-group', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<ce-tab-group></ce-tab-group>');

    const element = await page.find('ce-tab-group');
    expect(element).toHaveClass('hydrated');
  });
});

import { newE2EPage } from '@stencil/core/testing';

describe('ce-button-group', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<ce-button-group></ce-button-group>');

    const element = await page.find('ce-button-group');
    expect(element).toHaveClass('hydrated');
  });
});

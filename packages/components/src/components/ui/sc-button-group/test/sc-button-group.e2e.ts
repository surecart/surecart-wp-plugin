import { newE2EPage } from '@stencil/core/testing';

describe('sc-button-group', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<sc-button-group></sc-button-group>');

    const element = await page.find('sc-button-group');
    expect(element).toHaveClass('hydrated');
  });
});

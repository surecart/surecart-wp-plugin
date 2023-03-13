import { newE2EPage } from '@stencil/core/testing';

describe('sc-license-activations', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<sc-license-activations></sc-license-activations>');

    const element = await page.find('sc-license-activations');
    expect(element).toHaveClass('hydrated');
  });
});

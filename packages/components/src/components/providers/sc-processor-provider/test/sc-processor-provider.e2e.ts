import { newE2EPage } from '@stencil/core/testing';

describe('sc-processor-provider', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<sc-processor-provider></sc-processor-provider>');

    const element = await page.find('sc-processor-provider');
    expect(element).toHaveClass('hydrated');
  });
});

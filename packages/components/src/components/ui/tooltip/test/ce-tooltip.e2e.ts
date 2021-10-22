import { newE2EPage } from '@stencil/core/testing';

describe('ce-tooltip', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<ce-tooltip></ce-tooltip>');

    const element = await page.find('ce-tooltip');
    expect(element).toHaveClass('hydrated');
  });
});

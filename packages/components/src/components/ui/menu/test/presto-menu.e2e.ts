import { newE2EPage } from '@stencil/core/testing';

describe('presto-menu', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<presto-menu></presto-menu>');

    const element = await page.find('presto-menu');
    expect(element).toHaveClass('hydrated');
  });
});

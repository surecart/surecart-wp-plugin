import { newE2EPage } from '@stencil/core/testing';

describe('presto-select', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<presto-select></presto-select>');

    const element = await page.find('presto-select');
    expect(element).toHaveClass('hydrated');
  });
});

import { newE2EPage } from '@stencil/core/testing';

describe('presto-form-section', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<presto-form-section></presto-form-section>');

    const element = await page.find('presto-form-section');
    expect(element).toHaveClass('hydrated');
  });
});

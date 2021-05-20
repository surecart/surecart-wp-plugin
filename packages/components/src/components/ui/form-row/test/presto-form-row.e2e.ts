import { newE2EPage } from '@stencil/core/testing';

describe('presto-form-row', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<presto-form-row></presto-form-row>');

    const element = await page.find('presto-form-row');
    expect(element).toHaveClass('hydrated');
  });
});

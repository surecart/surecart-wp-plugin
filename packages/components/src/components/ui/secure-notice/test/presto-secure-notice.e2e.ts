import { newE2EPage } from '@stencil/core/testing';

describe('presto-secure-notice', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<presto-secure-notice></presto-secure-notice>');

    const element = await page.find('presto-secure-notice');
    expect(element).toHaveClass('hydrated');
  });
});

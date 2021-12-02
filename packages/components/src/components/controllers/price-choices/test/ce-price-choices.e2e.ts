import { newE2EPage } from '@stencil/core/testing';

describe('ce-price-choices', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<ce-price-choices></ce-price-choices>');
    const element = await page.find('ce-price-choices');
    expect(element).toHaveClass('hydrated');
  });

  it('has a busy state', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <ce-price-choices></ce-price-choices>
    `);
    await page.$eval('ce-price-choices', (elm: any) => {
      elm.choiceType = 'single';
      elm.busy = true;
    });

    await page.waitForChanges();
    const busy = await page.find('ce-price-choices ce-block-ui');
    expect(busy).not.toBeNull();
  });
});

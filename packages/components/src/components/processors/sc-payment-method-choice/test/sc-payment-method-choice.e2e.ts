import { newE2EPage } from '@stencil/core/testing';

describe('sc-payment-method-choice', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<sc-payment-method-choice></sc-payment-method-choice>');

    const element = await page.find('sc-payment-method-choice');
    expect(element).toHaveClass('hydrated');
  });

  it('Is toggled open if the processor id matches the current processor', async () => {
    const page = await newE2EPage();
    await page.setContent('<sc-payment-method-choice processor-id="test" has-others></sc-payment-method-choice>');
    const element = await page.find('sc-payment-method-choice');
    await page.waitForChanges();

    // not open.
    const toggle = await page.find('sc-payment-method-choice >>> sc-toggle');
    expect(await toggle.getProperty('open')).not.toBeTruthy();

    // open.
    element.setProperty('processor', 'test');
    await page.waitForChanges();
    expect(await toggle.getProperty('open')).toBeTruthy();
  });


  // it('Emits a scProcessorInvalid if selected and invalid', async () => {
  //   const page = await newE2EPage();
  //   await page.setContent('<sc-payment-method-choice processor-id="test" processor="test" has-others recurring-enabled="false"></sc-payment-method-choice>');
  //   await page.waitForChanges();
  //   const processorInvalid = await page.spyOnEvent('scProcessorInvalid');

  //   const element = await page.find('sc-payment-method-choice');
  //   element.setProperty("checkout", {
  //     reusable_payment_method_required: true,
  //   });

  //   await page.waitForChanges();

  //   expect(processorInvalid).toHaveReceivedEvent();
  // });
});

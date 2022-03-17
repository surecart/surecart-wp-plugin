import { newE2EPage } from '@stencil/core/testing';
import { setResponses } from '../../../../testing';

describe('ce-session-provider', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    setResponses(
      [
        {
          path: '/checkout-engine/v1/orders',
          data: {},
        },
      ],
      page,
    );
    await page.setContent('<ce-session-provider></ce-session-provider>');
    const element = await page.find('ce-session-provider');
    expect(element).toHaveClass('hydrated');
  });

  // it('redirects when order is paid', async () => {
  //   const page = await newE2EPage();

  //   window.location.assign = jest.fn(); // Create a spy
  //   const cePaid = await page.spyOnEvent('cePaid');
  //   await page.setContent('<ce-checkout><ce-session-provider><ce-form><ce-button submit></ce-button></ce-form></ce-session-provider></ce-checkout>');
  //   // const provider = await page.find('ce-session-provider');
  //   const button = await page.find('ce-button');
  //   button.click();
  //   await page.waitForChanges();
  //   // expect(cePaid).toHaveReceivedEvent();
  //   // expect(window.location.assign).toHaveBeenCalledWith('/auth/');
  // });
});

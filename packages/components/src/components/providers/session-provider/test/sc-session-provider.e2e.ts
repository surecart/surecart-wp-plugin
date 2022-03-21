import { newE2EPage } from '@stencil/core/testing';
import { setResponses } from '../../../../testing';

describe('sc-session-provider', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    setResponses(
      [
        {
          path: '/surecart/v1/orders',
          data: {},
        },
      ],
      page,
    );
    await page.setContent('<sc-session-provider></sc-session-provider>');
    const element = await page.find('sc-session-provider');
    expect(element).toHaveClass('hydrated');
  });

  // it('redirects when order is paid', async () => {
  //   const page = await newE2EPage();

  //   window.location.assign = jest.fn(); // Create a spy
  //   const cePaid = await page.spyOnEvent('cePaid');
  //   await page.setContent('<sc-checkout><sc-session-provider><sc-form><sc-button submit></sc-button></sc-form></sc-session-provider></sc-checkout>');
  //   // const provider = await page.find('sc-session-provider');
  //   const button = await page.find('sc-button');
  //   button.click();
  //   await page.waitForChanges();
  //   // expect(cePaid).toHaveReceivedEvent();
  //   // expect(window.location.assign).toHaveBeenCalledWith('/auth/');
  // });
});

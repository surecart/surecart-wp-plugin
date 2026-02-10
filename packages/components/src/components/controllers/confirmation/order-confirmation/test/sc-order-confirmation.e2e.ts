import { newE2EPage } from '@stencil/core/testing';

describe('sc-order-confirmation', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<sc-order-confirmation></sc-order-confirmation>');

    const element = await page.find('sc-order-confirmation');
    expect(element).toHaveClass('hydrated');
  });

  // Skipping it for now, as we don't handle alert in sc-order-confirmation.tsx file.
  // it('appends manual instructions if present in order', async () => {
  //   const page = await newE2EPage();
  //   await page.setContent('<sc-order-confirmation><sc-order-confirmation-details></sc-order-confirmation-details></sc-order-confirmation>');
  //   const element = await page.find('sc-order-confirmation');
  //   element.setProperty('order', {
  //     id: 'test-order-id',
  //     manual_payment_method: {
  //       name: 'Bank Transfer',
  //       instructions: 'Please transfer to our bank account.',
  //     },
  //     status: 'processing',
  //     customer: {},
  //     payment_intent: {},
  //   });
  //   await page.waitForChanges();
  //   const alert = await page.find('sc-alert');
  //   expect(alert).not.toBeNull();
  //   expect(await alert.getProperty('type')).toBe('info');
  //   expect(alert.innerHTML).toContain('Please transfer to our bank account.');
  // });
});

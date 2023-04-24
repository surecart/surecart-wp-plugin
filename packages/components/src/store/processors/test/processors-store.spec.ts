import { state as checkoutState, dispose as disposeCheckout } from '../../checkout';
import { Checkout, ManualPaymentMethod, PaymentMethodType, Processor } from '../../../types';
import {
  availableManualPaymentMethods,
  availableMethodChoices,
  availableMethodTypes,
  availableProcessorChoices,
  availableProcessors,
  getAvailableProcessor,
  hasMultipleMethodChoices,
  hasMultipleProcessorChoices,
} from '../getters';
import { state as processorsState, dispose as disposeProcessors } from '../index';
import { state as selectedProcessor } from '@store/selected-processor';

describe('Processors store', () => {
  beforeEach(() => {
    disposeCheckout();
    disposeProcessors();
  });

  describe('getters', () => {
    describe('availableProcessors', () => {
      it('returns all processors if no checkout', () => {
        processorsState.processors = [
          {
            live_mode: true,
            recurring_enabled: true,
            processor_type: 'stripe',
          },
          {
            live_mode: true,
            recurring_enabled: false,
            processor_type: 'paypal',
          },
        ] as Processor[];
        expect(availableProcessors()).toEqual(processorsState.processors);
      });

      it('filters processors by mode', () => {
        processorsState.processors = [
          {
            live_mode: true,
            recurring_enabled: true,
            processor_type: 'stripe',
          },
          {
            live_mode: true,
            recurring_enabled: false,
            processor_type: 'paypal',
          },
        ] as Processor[];
        checkoutState.formId = 1;
        checkoutState.mode = 'test';
        expect(availableProcessors()).toEqual([]);

        processorsState.processors = [
          {
            live_mode: false,
            recurring_enabled: true,
            processor_type: 'stripe',
          },
          {
            live_mode: true,
            recurring_enabled: true,
            processor_type: 'paypal',
          },
        ] as Processor[];
        expect(availableProcessors()).toEqual([
          {
            live_mode: false,
            recurring_enabled: true,
            processor_type: 'stripe',
          },
        ]);
      });

      it('filters processors by recurring', () => {
        processorsState.processors = [
          {
            live_mode: true,
            recurring_enabled: true,
            processor_type: 'stripe',
          },
          {
            live_mode: true,
            recurring_enabled: false,
            processor_type: 'paypal',
          },
        ] as Processor[];

        checkoutState.formId = 2;
        checkoutState.mode = 'live';
        checkoutState.checkout = {
          live_mode: true,
          reusable_payment_method_required: true,
        } as Checkout;

        expect(availableProcessors()).toEqual([
          {
            live_mode: true,
            recurring_enabled: true,
            processor_type: 'stripe',
          },
        ]);
      });

      it('sorts processors by sort order', () => {
        processorsState.sortOrder.processors = ['paypal', 'stripe'];
        processorsState.processors = [
          {
            live_mode: true,
            recurring_enabled: true,
            processor_type: 'stripe',
          },
          {
            live_mode: true,
            recurring_enabled: false,
            processor_type: 'paypal',
          },
        ] as Processor[];

        expect(availableProcessors()).toEqual([
          {
            live_mode: true,
            recurring_enabled: false,
            processor_type: 'paypal',
          },
          {
            live_mode: true,
            recurring_enabled: true,
            processor_type: 'stripe',
          },
        ]);
      });
    });

    describe('getAvailableProcessor', () => {
      it('gets the processor only if it is available', () => {
        processorsState.processors = [
          {
            live_mode: true,
            recurring_enabled: true,
            processor_type: 'stripe',
          },
          {
            live_mode: true,
            recurring_enabled: false,
            processor_type: 'paypal',
          },
        ] as Processor[];
        checkoutState.formId = 1;
        checkoutState.mode = 'test';
        expect(getAvailableProcessor('stripe')).toEqual(undefined);

        processorsState.processors = [
          {
            live_mode: true,
            recurring_enabled: true,
            processor_type: 'stripe',
          },
          {
            live_mode: true,
            recurring_enabled: false,
            processor_type: 'paypal',
          },
        ] as Processor[];
        checkoutState.formId = 1;
        checkoutState.mode = 'live';
        expect(getAvailableProcessor('stripe')).toEqual({
          live_mode: true,
          recurring_enabled: true,
          processor_type: 'stripe',
        });
      });
    });

    describe('availableManualPaymentMethods', () => {
      it('is empty if reusable payment method is required', () => {
        processorsState.manualPaymentMethods = [
          {
            id: 'test1',
            name: 'Test 1',
            description: 'Test 1',
          },
          {
            id: 'test1',
            name: 'Test 2',
            description: 'Test 2',
          },
        ] as ManualPaymentMethod[];
        checkoutState.formId = 2;
        checkoutState.mode = 'live';
        checkoutState.checkout = {
          live_mode: true,
          reusable_payment_method_required: true,
        } as Checkout;
        expect(availableManualPaymentMethods()).toEqual([]);
      });

      it('gets all manual methods if recurring is not required', () => {
        processorsState.manualPaymentMethods = [
          {
            id: 'test1',
            name: 'Test 1',
            description: 'Test 1',
          },
          {
            id: 'test1',
            name: 'Test 2',
            description: 'Test 2',
          },
        ] as ManualPaymentMethod[];
        checkoutState.formId = 2;
        checkoutState.mode = 'live';
        checkoutState.checkout = {
          live_mode: true,
          reusable_payment_method_required: false,
        } as Checkout;
        expect(availableManualPaymentMethods()).toEqual(processorsState.manualPaymentMethods);
      });
    });

    describe('availableMethodTypes', () => {
      it('shows credit card, then paypal by default', () => {
        processorsState.methods = [
          {
            id: 'ideal',
            description: 'Test 1',
          },
          {
            id: 'paypal',
            description: 'Test 1',
          },
          {
            id: 'creditcard',
            description: 'Test 2',
          },
        ] as PaymentMethodType[];

        expect(availableMethodTypes()).toEqual([
          {
            id: 'creditcard',
            description: 'Test 2',
          },
          {
            id: 'paypal',
            description: 'Test 1',
          },
          {
            id: 'ideal',
            description: 'Test 1',
          },
        ]);
      });
      it('can have a custom order', () => {
        processorsState.methods = [
          {
            id: 'ideal',
            description: 'Test 1',
          },
          {
            id: 'paypal',
            description: 'Test 1',
          },
          {
            id: 'creditcard',
            description: 'Test 2',
          },
        ] as PaymentMethodType[];
        processorsState.sortOrder.paymentMethods.mollie = ['ideal', 'paypal', 'creditcard'];

        expect(availableMethodTypes()).toEqual([
          {
            id: 'ideal',
            description: 'Test 1',
          },
          {
            id: 'paypal',
            description: 'Test 1',
          },
          {
            id: 'creditcard',
            description: 'Test 2',
          },
        ]);
      });
    });

    describe('availableProcessorChoices, hasMultipleProcessorChoices', () => {
      it('shows both available processors and available payment methods', () => {
        processorsState.processors = [
          {
            live_mode: true,
            recurring_enabled: true,
            processor_type: 'stripe',
          },
          {
            live_mode: true,
            recurring_enabled: false,
            processor_type: 'paypal',
          },
        ] as Processor[];
        processorsState.manualPaymentMethods = [
          {
            id: 'test1',
            name: 'Test 1',
            description: 'Test 1',
          },
          {
            id: 'test1',
            name: 'Test 2',
            description: 'Test 2',
          },
        ] as ManualPaymentMethod[];
        checkoutState.formId = 2;
        checkoutState.mode = 'live';
        checkoutState.checkout = {
          live_mode: true,
        } as Checkout;
        expect(availableProcessorChoices()).toEqual([...processorsState.processors, ...processorsState.manualPaymentMethods]);
        expect(hasMultipleProcessorChoices()).toBeTruthy();

        checkoutState.checkout = {
          live_mode: true,
          reusable_payment_method_required: true,
        } as Checkout;
        expect(availableProcessorChoices()).toEqual([
          {
            live_mode: true,
            recurring_enabled: true,
            processor_type: 'stripe',
          },
        ]);
        expect(hasMultipleProcessorChoices()).toBeFalsy();
      });
    });

    describe('availableMethodChoices, hasMultipleMethodChoices', () => {
      it('shows both available processors and available payment methods', () => {
        processorsState.methods = [
          {
            id: 'creditcard',
            description: 'Test 2',
          },
        ] as PaymentMethodType[];
        processorsState.manualPaymentMethods = [
          {
            id: 'test1',
            name: 'Test 1',
            description: 'Test 1',
          },
          {
            id: 'test1',
            name: 'Test 2',
            description: 'Test 2',
          },
        ] as ManualPaymentMethod[];
        checkoutState.formId = 2;
        checkoutState.mode = 'live';
        checkoutState.checkout = {
          live_mode: true,
        } as Checkout;
        expect(availableMethodChoices()).toEqual([...processorsState.methods, ...processorsState.manualPaymentMethods]);
        expect(hasMultipleMethodChoices()).toBeTruthy();

        checkoutState.checkout = {
          live_mode: true,
          reusable_payment_method_required: true,
        } as Checkout;

        expect(availableMethodChoices()).toEqual([
          {
            id: 'creditcard',
            description: 'Test 2',
          },
        ]);
        expect(hasMultipleProcessorChoices()).toBeFalsy();
      });
    });
  });

  describe('watchers', () => {
    it('changes the selected processor if it is not available', () => {
      processorsState.processors = [
        {
          live_mode: true,
          recurring_enabled: true,
          processor_type: 'stripe',
        },
        {
          live_mode: true,
          recurring_enabled: false,
          processor_type: 'paypal',
        },
      ] as Processor[];
      processorsState.manualPaymentMethods = [
        {
          id: 'test1',
          name: 'Test 1',
          description: 'Test 1',
        },
        {
          id: 'test2',
          name: 'Test 2',
          description: 'Test 2',
        },
      ] as ManualPaymentMethod[];
      selectedProcessor.id = 'test1';
      expect(selectedProcessor.id).toBe('test1');

      checkoutState.formId = 2;
      checkoutState.mode = 'live';
      checkoutState.checkout = {
        live_mode: true,
        reusable_payment_method_required: true,
      } as Checkout;

      expect(selectedProcessor.id).toBe('stripe');

      checkoutState.checkout = {
        live_mode: true,
        reusable_payment_method_required: false,
      } as Checkout;

      selectedProcessor.id = 'test2';
      expect(selectedProcessor.id).toBe('test2');
      checkoutState.checkout = {
        live_mode: true,
        reusable_payment_method_required: true,
        amount_due: 1000,
      } as Checkout;
      expect(selectedProcessor.id).toBe('stripe');
    });
  });
});

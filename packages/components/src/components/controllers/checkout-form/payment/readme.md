# ce-payment



<!-- Auto Generated Below -->


## Properties

| Property               | Attribute                | Description                                                          | Type                                    | Default     |
| ---------------------- | ------------------------ | -------------------------------------------------------------------- | --------------------------------------- | ----------- |
| `busy`                 | `busy`                   | Is this busy.                                                        | `boolean`                               | `undefined` |
| `currencyCode`         | `currency-code`          | The currency code.                                                   | `string`                                | `'usd'`     |
| `defaultProcessor`     | `default-processor`      | Default                                                              | `"paypal" \| "paypal-card" \| "stripe"` | `'stripe'`  |
| `hideTestModeBadge`    | `hide-test-mode-badge`   | Hide the test mode badge                                             | `boolean`                               | `undefined` |
| `label`                | `label`                  | The input's label.                                                   | `string`                                | `undefined` |
| `loading`              | `loading`                | Is this loading.                                                     | `boolean`                               | `undefined` |
| `manualPaymentMethods` | --                       | Manual payment methods.                                              | `ManualPaymentMethod[]`                 | `[]`        |
| `mode`                 | `mode`                   | Is this created in "test" mode                                       | `"live" \| "test"`                      | `'live'`    |
| `order`                | --                       | Checkout Session from sc-checkout.                                   | `Checkout`                              | `undefined` |
| `paymentMethod`        | `payment-method`         | Payment mode inside individual payment method (i.e. Payment Buttons) | `"stripe-payment-request"`              | `undefined` |
| `processor`            | `processor`              | The current payment method for the payment                           | `string`                                | `'stripe'`  |
| `processors`           | --                       | List of available processors.                                        | `Processor[]`                           | `[]`        |
| `secureNotice`         | `secure-notice`          | Secure notice                                                        | `string`                                | `undefined` |
| `stripePaymentElement` | `stripe-payment-element` | Use the Stripe payment element.                                      | `boolean`                               | `undefined` |
| `stripePaymentIntent`  | --                       | The stripe payment intent.                                           | `PaymentIntent`                         | `undefined` |


## Events

| Event            | Description             | Type                  |
| ---------------- | ----------------------- | --------------------- |
| `scSetProcessor` | Set the order procesor. | `CustomEvent<string>` |


## Dependencies

### Depends on

- [sc-stripe-payment-element](../../../ui/stripe-payment-element)
- [sc-stripe-element](../../../ui/stripe-element)
- [sc-secure-notice](../../../ui/secure-notice)
- [sc-tag](../../../ui/tag)
- [sc-stripe-payment-method-choice](../../../processors/sc-stripe-payment-method-choice)
- [sc-toggle](../../../ui/sc-toggle)
- [sc-icon](../../../ui/icon)
- [sc-card](../../../ui/card)
- [sc-payment-selected](../../../ui/payment-selected)
- [sc-form-control](../../../ui/form-control)
- [sc-toggles](../../../ui/sc-toggles)
- [sc-skeleton](../../../ui/skeleton)
- [sc-alert](../../../ui/alert)
- [sc-processor-provider](../../../providers/processor-provider)

### Graph
```mermaid
graph TD;
  sc-payment --> sc-stripe-payment-element
  sc-payment --> sc-stripe-element
  sc-payment --> sc-secure-notice
  sc-payment --> sc-tag
  sc-payment --> sc-stripe-payment-method-choice
  sc-payment --> sc-toggle
  sc-payment --> sc-icon
  sc-payment --> sc-card
  sc-payment --> sc-payment-selected
  sc-payment --> sc-form-control
  sc-payment --> sc-toggles
  sc-payment --> sc-skeleton
  sc-payment --> sc-alert
  sc-payment --> sc-processor-provider
  sc-stripe-payment-element --> sc-text
  sc-stripe-payment-element --> sc-skeleton
  sc-stripe-element --> sc-input
  sc-stripe-element --> sc-text
  sc-input --> sc-form-control
  sc-form-control --> sc-tooltip
  sc-stripe-payment-method-choice --> sc-stripe-payment-element
  sc-stripe-payment-method-choice --> sc-stripe-element
  sc-stripe-payment-method-choice --> sc-secure-notice
  sc-stripe-payment-method-choice --> sc-payment-method-choice
  sc-stripe-payment-method-choice --> sc-icon
  sc-payment-method-choice --> sc-toggle
  sc-toggle --> sc-icon
  sc-payment-selected --> sc-divider
  sc-alert --> sc-icon
  style sc-payment fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*

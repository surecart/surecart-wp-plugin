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
| `mode`                 | `mode`                   | Is this created in "test" mode                                       | `"live" \| "test"`                      | `'live'`    |
| `order`                | --                       | Checkout Session from sc-checkout.                                   | `Checkout`                              | `undefined` |
| `paymentMethod`        | `payment-method`         | Payment mode inside individual payment method (i.e. Payment Buttons) | `"stripe-payment-request"`              | `undefined` |
| `processor`            | `processor`              | The current payment method for the payment                           | `string`                                | `'stripe'`  |
| `processors`           | --                       | List of available processors.                                        | `Processor[]`                           | `[]`        |
| `secureNotice`         | `secure-notice`          | Secure notice                                                        | `string`                                | `undefined` |
| `stripePaymentElement` | `stripe-payment-element` | Use the Stripe payment element.                                      | `boolean`                               | `undefined` |
| `stripePaymentIntent`  | --                       | The stripe payment intent.                                           | `PaymentIntent`                         | `undefined` |


## Events

| Event            | Description             | Type                                                 |
| ---------------- | ----------------------- | ---------------------------------------------------- |
| `scSetProcessor` | Set the order procesor. | `CustomEvent<"paypal" \| "paypal-card" \| "stripe">` |


## Shadow Parts

| Part                           | Description                                    |
| ------------------------------ | ---------------------------------------------- |
| `"base"`                       | The elements base wrapper.                     |
| `"form-control"`               | The form control wrapper.                      |
| `"help-text"`                  | Help text that describes how to use the input. |
| `"instructions"`               | Payment instructions.                          |
| `"instructions__divider"`      | Payment instructions divider.                  |
| `"instructions__divider-line"` | Payment instructions divider line.             |
| `"instructions__text"`         | Payment instructions text.                     |
| `"label"`                      | The input label.                               |
| `"loading"`                    |                                                |
| `"secure-notice__base"`        | Secure notice base.                            |
| `"secure-notice__icon"`        | Secure notice icon.                            |
| `"secure-notice__text"`        | Secure notice text.                            |
| `"test-badge__base"`           | Test badge base.                               |
| `"test-badge__content"`        | Test badge content.                            |
| `"toggle"`                     |                                                |
| `"toggle__base"`               | Toggle base.                                   |
| `"toggle__content"`            | Toggle content                                 |
| `"toggle__header"`             | Toggle header                                  |
| `"toggle__radio"`              | Toggle radio                                   |
| `"toggle__summary"`            | Toggle summary                                 |
| `"toggle__summary-icon"`       | Toggle icon                                    |
| `"toggles"`                    |                                                |


## Dependencies

### Depends on

- [sc-stripe-payment-element](../../../ui/stripe-payment-element)
- [sc-stripe-element](../../../ui/stripe-element)
- [sc-secure-notice](../../../ui/secure-notice)
- [sc-tag](../../../ui/tag)
- [sc-form-control](../../../ui/form-control)
- [sc-toggles](../../../ui/sc-toggles)
- [sc-toggle](../../../ui/sc-toggle)
- [sc-icon](../../../ui/icon)
- [sc-card](../../../ui/card)
- [sc-payment-selected](../../../ui/payment-selected)
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
  sc-payment --> sc-form-control
  sc-payment --> sc-toggles
  sc-payment --> sc-toggle
  sc-payment --> sc-icon
  sc-payment --> sc-card
  sc-payment --> sc-payment-selected
  sc-payment --> sc-skeleton
  sc-payment --> sc-alert
  sc-payment --> sc-processor-provider
  sc-stripe-payment-element --> sc-text
  sc-stripe-payment-element --> sc-skeleton
  sc-stripe-element --> sc-input
  sc-stripe-element --> sc-text
  sc-input --> sc-form-control
  sc-form-control --> sc-tooltip
  sc-toggle --> sc-icon
  sc-payment-selected --> sc-divider
  sc-alert --> sc-icon
  style sc-payment fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*

# ce-payment



<!-- Auto Generated Below -->


## Properties

| Property                 | Attribute                | Description              | Type       | Default     |
| ------------------------ | ------------------------ | ------------------------ | ---------- | ----------- |
| `disabledProcessorTypes` | --                       | Disabled processor types | `string[]` | `undefined` |
| `hideTestModeBadge`      | `hide-test-mode-badge`   | Hide the test mode badge | `boolean`  | `undefined` |
| `label`                  | `label`                  | The input's label.       | `string`   | `undefined` |
| `secureNotice`           | `secure-notice`          |                          | `string`   | `undefined` |
| `stripePaymentElement`   | `stripe-payment-element` |                          | `boolean`  | `undefined` |


## Shadow Parts

| Part                    | Description                                    |
| ----------------------- | ---------------------------------------------- |
| `"base"`                | The elements base wrapper.                     |
| `"form-control"`        | The form control wrapper.                      |
| `"help-text"`           | Help text that describes how to use the input. |
| `"label"`               | The input label.                               |
| `"test-badge__base"`    | Test badge base.                               |
| `"test-badge__content"` | Test badge content.                            |


## Dependencies

### Depends on

- [sc-payment-method-choice](../../../processors/sc-payment-method-choice)
- [sc-icon](../../../ui/icon)
- [sc-card](../../../ui/card)
- [sc-payment-selected](../../../ui/payment-selected)
- [sc-form-control](../../../ui/form-control)
- [sc-tag](../../../ui/tag)
- [sc-checkout-mollie-payment](../sc-checkout-mollie-payment)
- [sc-alert](../../../ui/alert)

### Graph
```mermaid
graph TD;
  sc-payment --> sc-payment-method-choice
  sc-payment --> sc-icon
  sc-payment --> sc-card
  sc-payment --> sc-payment-selected
  sc-payment --> sc-form-control
  sc-payment --> sc-tag
  sc-payment --> sc-checkout-mollie-payment
  sc-payment --> sc-alert
  sc-payment-method-choice --> sc-card
  sc-payment-selected --> sc-divider
  sc-form-control --> sc-tooltip
  sc-checkout-mollie-payment --> sc-card
  sc-checkout-mollie-payment --> sc-skeleton
  sc-checkout-mollie-payment --> sc-alert
  sc-checkout-mollie-payment --> sc-payment-method-choice
  sc-checkout-mollie-payment --> sc-payment-selected
  sc-checkout-mollie-payment --> sc-block-ui
  sc-alert --> sc-icon
  sc-block-ui --> sc-spinner
  style sc-payment fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*

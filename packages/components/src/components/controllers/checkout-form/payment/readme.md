# ce-payment



<!-- Auto Generated Below -->


## Properties

| Property        | Attribute        | Description                                                          | Type                       | Default     |
| --------------- | ---------------- | -------------------------------------------------------------------- | -------------------------- | ----------- |
| `busy`          | `busy`           | Is this busy.                                                        | `boolean`                  | `undefined` |
| `label`         | `label`          | The input's label.                                                   | `string`                   | `undefined` |
| `loading`       | `loading`        | Is this loading.                                                     | `boolean`                  | `undefined` |
| `mode`          | `mode`           | Is this created in "test" mode                                       | `"live" \| "test"`         | `'live'`    |
| `order`         | --               | Checkout Session from sc-checkout.                                   | `Order`                    | `undefined` |
| `paymentMethod` | `payment-method` | Payment mode inside individual payment method (i.e. Payment Buttons) | `"stripe-payment-request"` | `undefined` |
| `processor`     | `processor`      | The current payment method for the payment                           | `string`                   | `'stripe'`  |
| `secureNotice`  | `secure-notice`  | Secure notice                                                        | `string`                   | `undefined` |


## Dependencies

### Depends on

- [sc-skeleton](../../../ui/skeleton)
- [sc-stripe-element](../../../ui/stripe-element)
- [sc-secure-notice](../../../ui/secure-notice)
- [sc-tooltip](../../../ui/tooltip)
- [sc-tag](../../../ui/tag)
- [sc-block-ui](../../../ui/block-ui)

### Graph
```mermaid
graph TD;
  sc-payment --> sc-skeleton
  sc-payment --> sc-stripe-element
  sc-payment --> sc-secure-notice
  sc-payment --> sc-tooltip
  sc-payment --> sc-tag
  sc-payment --> sc-block-ui
  sc-stripe-element --> sc-input
  sc-stripe-element --> sc-text
  sc-input --> sc-form-control
  sc-form-control --> sc-tooltip
  sc-block-ui --> sc-spinner
  style sc-payment fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*

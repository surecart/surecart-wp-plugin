# ce-payment



<!-- Auto Generated Below -->


## Properties

| Property        | Attribute        | Description                                                          | Type                       | Default     |
| --------------- | ---------------- | -------------------------------------------------------------------- | -------------------------- | ----------- |
| `busy`          | `busy`           | Is this busy.                                                        | `boolean`                  | `undefined` |
| `currencyCode`  | `currency-code`  | The currency code.                                                   | `string`                   | `'usd'`     |
| `label`         | `label`          | The input's label.                                                   | `string`                   | `undefined` |
| `loading`       | `loading`        | Is this loading.                                                     | `boolean`                  | `undefined` |
| `mode`          | `mode`           | Is this created in "test" mode                                       | `"live" \| "test"`         | `'live'`    |
| `order`         | --               | Checkout Session from sc-checkout.                                   | `Order`                    | `undefined` |
| `paymentMethod` | `payment-method` | Payment mode inside individual payment method (i.e. Payment Buttons) | `"stripe-payment-request"` | `undefined` |
| `processor`     | `processor`      | The current payment method for the payment                           | `string`                   | `'stripe'`  |
| `processors`    | --               | List of available processors.                                        | `Processor[]`              | `undefined` |
| `secureNotice`  | `secure-notice`  | Secure notice                                                        | `string`                   | `undefined` |


## Events

| Event             | Description          | Type                  |
| ----------------- | -------------------- | --------------------- |
| `scSetOrderState` | Set the order state. | `CustomEvent<object>` |


## Dependencies

### Depends on

- [sc-order-stripe-payment-element](../sc-order-stripe-payment-element)
- [sc-form-control](../../../ui/form-control)
- [sc-tag](../../../ui/tag)
- [sc-toggles](../../../ui/sc-toggles)
- [sc-toggle](../../../ui/sc-toggle)
- [sc-icon](../../../ui/icon)
- [sc-skeleton](../../../ui/skeleton)
- [sc-alert](../../../ui/alert)
- [sc-card](../../../ui/card)

### Graph
```mermaid
graph TD;
  sc-payment --> sc-order-stripe-payment-element
  sc-payment --> sc-form-control
  sc-payment --> sc-tag
  sc-payment --> sc-toggles
  sc-payment --> sc-toggle
  sc-payment --> sc-icon
  sc-payment --> sc-skeleton
  sc-payment --> sc-alert
  sc-payment --> sc-card
  sc-order-stripe-payment-element --> sc-stripe-payment-element
  sc-stripe-payment-element --> sc-text
  sc-stripe-payment-element --> sc-skeleton
  sc-form-control --> sc-tooltip
  sc-toggle --> sc-icon
  sc-alert --> sc-icon
  style sc-payment fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*

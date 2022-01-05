# ce-payment



<!-- Auto Generated Below -->


## Properties

| Property          | Attribute        | Description                                                          | Type                       | Default     |
| ----------------- | ---------------- | -------------------------------------------------------------------- | -------------------------- | ----------- |
| `checkoutSession` | --               | Checkout Session from ce-checkout.                                   | `CheckoutSession`          | `undefined` |
| `label`           | `label`          | The input's label.                                                   | `string`                   | `undefined` |
| `mode`            | `mode`           | Is this created in "test" mode                                       | `"live" \| "test"`         | `'live'`    |
| `paymentMethod`   | `payment-method` | Payment mode inside individual payment method (i.e. Payment Buttons) | `"stripe-payment-request"` | `undefined` |
| `processor`       | `processor`      | The current payment method for the payment                           | `string`                   | `'stripe'`  |
| `secureNotice`    | `secure-notice`  | Secure notice                                                        | `string`                   | `undefined` |


## Dependencies

### Depends on

- [ce-skeleton](../../ui/skeleton)
- [ce-stripe-element](../../ui/stripe-element)
- [ce-secure-notice](../../ui/secure-notice)
- [ce-badge-notice](../../ui/badge-notice)

### Graph
```mermaid
graph TD;
  ce-payment --> ce-skeleton
  ce-payment --> ce-stripe-element
  ce-payment --> ce-secure-notice
  ce-payment --> ce-badge-notice
  ce-stripe-element --> ce-input
  ce-input --> ce-form-control
  ce-form-control --> ce-tooltip
  ce-badge-notice --> ce-tag
  style ce-payment fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*

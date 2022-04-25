# sc-order-stripe-payment-element



<!-- Auto Generated Below -->


## Properties

| Property       | Attribute       | Description                                | Type               | Default     |
| -------------- | --------------- | ------------------------------------------ | ------------------ | ----------- |
| `address`      | `address`       | Should we collect an address?              | `boolean`          | `undefined` |
| `currencyCode` | `currency-code` | The currency code for the payment element. | `string`           | `'usd'`     |
| `mode`         | `mode`          | Payment mode.                              | `"live" \| "test"` | `'live'`    |
| `order`        | --              | The order.                                 | `Order`            | `undefined` |
| `processors`   | --              | Available processors                       | `Processor[]`      | `[]`        |


## Events

| Event                | Description | Type                                                                   |
| -------------------- | ----------- | ---------------------------------------------------------------------- |
| `scPaid`             |             | `CustomEvent<void>`                                                    |
| `scPayError`         |             | `CustomEvent<any>`                                                     |
| `scSetPaymentIntent` |             | `CustomEvent<{ processor: "stripe"; payment_intent: PaymentIntent; }>` |


## Dependencies

### Used by

 - [sc-payment](../payment)

### Depends on

- [sc-stripe-payment-element](../../../ui/stripe-payment-element)

### Graph
```mermaid
graph TD;
  sc-order-stripe-payment-element --> sc-stripe-payment-element
  sc-stripe-payment-element --> sc-text
  sc-stripe-payment-element --> sc-skeleton
  sc-payment --> sc-order-stripe-payment-element
  style sc-order-stripe-payment-element fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*

# sc-checkout-mollie-payment



<!-- Auto Generated Below -->


## Properties

| Property      | Attribute      | Description | Type     | Default     |
| ------------- | -------------- | ----------- | -------- | ----------- |
| `method`      | `method`       |             | `string` | `undefined` |
| `processorId` | `processor-id` |             | `string` | `undefined` |


## Events

| Event     | Description | Type                         |
| --------- | ----------- | ---------------------------- |
| `scError` | Error event | `CustomEvent<ResponseError>` |


## Dependencies

### Used by

 - [sc-payment](../payment)

### Depends on

- [sc-card](../../../ui/card)
- [sc-skeleton](../../../ui/skeleton)
- [sc-alert](../../../ui/alert)
- [sc-payment-method-choice](../../../processors/sc-payment-method-choice)
- [sc-payment-selected](../../../ui/payment-selected)
- [sc-block-ui](../../../ui/block-ui)

### Graph
```mermaid
graph TD;
  sc-checkout-mollie-payment --> sc-card
  sc-checkout-mollie-payment --> sc-skeleton
  sc-checkout-mollie-payment --> sc-alert
  sc-checkout-mollie-payment --> sc-payment-method-choice
  sc-checkout-mollie-payment --> sc-payment-selected
  sc-checkout-mollie-payment --> sc-block-ui
  sc-alert --> sc-icon
  sc-payment-method-choice --> sc-card
  sc-payment-selected --> sc-divider
  sc-block-ui --> sc-spinner
  sc-payment --> sc-checkout-mollie-payment
  style sc-checkout-mollie-payment fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*

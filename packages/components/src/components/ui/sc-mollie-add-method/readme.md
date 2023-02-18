# sc-mollie-add-method



<!-- Auto Generated Below -->


## Properties

| Property      | Attribute      | Description | Type      | Default     |
| ------------- | -------------- | ----------- | --------- | ----------- |
| `country`     | `country`      |             | `string`  | `undefined` |
| `currency`    | `currency`     |             | `string`  | `undefined` |
| `customerId`  | `customer-id`  |             | `string`  | `undefined` |
| `liveMode`    | `live-mode`    |             | `boolean` | `undefined` |
| `processorId` | `processor-id` |             | `string`  | `undefined` |


## Dependencies

### Depends on

- [sc-toggles](../sc-toggles)
- [sc-toggle](../sc-toggle)
- [sc-card](../card)
- [sc-payment-selected](../payment-selected)

### Graph
```mermaid
graph TD;
  sc-mollie-add-method --> sc-toggles
  sc-mollie-add-method --> sc-toggle
  sc-mollie-add-method --> sc-card
  sc-mollie-add-method --> sc-payment-selected
  sc-toggle --> sc-icon
  sc-payment-selected --> sc-divider
  style sc-mollie-add-method fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*

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
| `successUrl`  | `success-url`  |             | `string`  | `undefined` |


## Dependencies

### Depends on

- [sc-card](../card)
- [sc-skeleton](../skeleton)
- [sc-form](../form)
- [sc-toggles](../sc-toggles)
- [sc-toggle](../sc-toggle)
- [sc-payment-selected](../payment-selected)
- [sc-button](../button)
- [sc-block-ui](../block-ui)

### Graph
```mermaid
graph TD;
  sc-mollie-add-method --> sc-card
  sc-mollie-add-method --> sc-skeleton
  sc-mollie-add-method --> sc-form
  sc-mollie-add-method --> sc-toggles
  sc-mollie-add-method --> sc-toggle
  sc-mollie-add-method --> sc-payment-selected
  sc-mollie-add-method --> sc-button
  sc-mollie-add-method --> sc-block-ui
  sc-toggle --> sc-icon
  sc-payment-selected --> sc-divider
  sc-button --> sc-spinner
  sc-block-ui --> sc-spinner
  style sc-mollie-add-method fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*

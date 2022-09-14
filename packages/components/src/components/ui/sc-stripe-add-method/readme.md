# sc-stripe-add-method



<!-- Auto Generated Below -->


## Properties

| Property     | Attribute     | Description | Type      | Default     |
| ------------ | ------------- | ----------- | --------- | ----------- |
| `customerId` | `customer-id` |             | `string`  | `undefined` |
| `liveMode`   | `live-mode`   |             | `boolean` | `true`      |
| `successUrl` | `success-url` |             | `string`  | `undefined` |


## Dependencies

### Depends on

- [sc-form](../form)
- [sc-alert](../alert)
- [sc-skeleton](../skeleton)
- [sc-button](../button)

### Graph
```mermaid
graph TD;
  sc-stripe-add-method --> sc-form
  sc-stripe-add-method --> sc-alert
  sc-stripe-add-method --> sc-skeleton
  sc-stripe-add-method --> sc-button
  sc-alert --> sc-icon
  sc-button --> sc-spinner
  style sc-stripe-add-method fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*

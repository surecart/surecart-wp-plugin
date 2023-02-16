# order-confirm-modal



<!-- Auto Generated Below -->


## Properties

| Property     | Attribute     | Description           | Type      | Default |
| ------------ | ------------- | --------------------- | --------- | ------- |
| `open`       | `open`        | Whether modal is open | `boolean` | `false` |
| `successUrl` | `success-url` | The success url       | `string`  | `''`    |


## Dependencies

### Used by

 - [sc-order-confirm-provider](../../providers/order-confirm-provider)

### Depends on

- [sc-dialog](../sc-dialog)
- [sc-flex](../flex)
- [sc-text](../text)
- [sc-button](../button)

### Graph
```mermaid
graph TD;
  order-confirm-modal --> sc-dialog
  order-confirm-modal --> sc-flex
  order-confirm-modal --> sc-text
  order-confirm-modal --> sc-button
  sc-dialog --> sc-button
  sc-dialog --> sc-icon
  sc-button --> sc-spinner
  sc-order-confirm-provider --> order-confirm-modal
  style order-confirm-modal fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*

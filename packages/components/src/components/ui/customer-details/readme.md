# ce-customer-details



<!-- Auto Generated Below -->


## Properties

| Property   | Attribute   | Description | Type       | Default     |
| ---------- | ----------- | ----------- | ---------- | ----------- |
| `customer` | --          |             | `Customer` | `undefined` |
| `editLink` | `edit-link` |             | `string`   | `undefined` |
| `error`    | `error`     |             | `string`   | `undefined` |
| `heading`  | `heading`   |             | `string`   | `undefined` |
| `loading`  | `loading`   |             | `boolean`  | `undefined` |


## Dependencies

### Used by

 - [sc-dashboard-customer-details](../../controllers/dashboard/customer-details)
 - [sc-order-confirmation-customer](../../controllers/confirmation/order-confirmation-customer)

### Depends on

- [sc-stacked-list-row](../stacked-list-row)
- [sc-tag](../tag)
- [sc-skeleton](../skeleton)
- [sc-dashboard-module](../dashboard-module)
- [sc-button](../button)
- [sc-icon](../icon)
- [sc-card](../card)
- [sc-stacked-list](../stacked-list)

### Graph
```mermaid
graph TD;
  sc-customer-details --> sc-stacked-list-row
  sc-customer-details --> sc-tag
  sc-customer-details --> sc-skeleton
  sc-customer-details --> sc-dashboard-module
  sc-customer-details --> sc-button
  sc-customer-details --> sc-icon
  sc-customer-details --> sc-card
  sc-customer-details --> sc-stacked-list
  sc-dashboard-module --> sc-alert
  sc-alert --> sc-icon
  sc-button --> sc-spinner
  sc-dashboard-customer-details --> sc-customer-details
  sc-order-confirmation-customer --> sc-customer-details
  style sc-customer-details fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*

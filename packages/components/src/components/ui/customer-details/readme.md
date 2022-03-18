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

 - [ce-dashboard-customer-details](../../controllers/dashboard/customer-details)
 - [ce-order-confirmation-customer](../../controllers/confirmation/order-confirmation-customer)

### Depends on

- [ce-stacked-list-row](../stacked-list-row)
- [ce-tag](../tag)
- [ce-skeleton](../skeleton)
- [ce-dashboard-module](../dashboard-module)
- [ce-button](../button)
- [ce-icon](../icon)
- [ce-card](../card)
- [ce-stacked-list](../stacked-list)

### Graph
```mermaid
graph TD;
  ce-customer-details --> ce-stacked-list-row
  ce-customer-details --> ce-tag
  ce-customer-details --> ce-skeleton
  ce-customer-details --> ce-dashboard-module
  ce-customer-details --> ce-button
  ce-customer-details --> ce-icon
  ce-customer-details --> ce-card
  ce-customer-details --> ce-stacked-list
  ce-dashboard-module --> ce-alert
  ce-alert --> ce-icon
  ce-button --> ce-spinner
  ce-dashboard-customer-details --> ce-customer-details
  ce-order-confirmation-customer --> ce-customer-details
  style ce-customer-details fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*

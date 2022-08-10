# ce-customer-subscriptions-list



<!-- Auto Generated Below -->


## Properties

| Property       | Attribute       | Description | Type         | Default     |
| -------------- | --------------- | ----------- | ------------ | ----------- |
| `allLink`      | `all-link`      |             | `string`     | `undefined` |
| `busy`         | `busy`          |             | `boolean`    | `undefined` |
| `error`        | `error`         |             | `string`     | `undefined` |
| `heading`      | `heading`       |             | `string`     | `undefined` |
| `loading`      | `loading`       |             | `boolean`    | `undefined` |
| `purchases`    | --              |             | `Purchase[]` | `[]`        |
| `requestNonce` | `request-nonce` |             | `string`     | `undefined` |


## Dependencies

### Used by

 - [sc-dashboard-downloads-list](../../controllers/dashboard/dashboard-downloads-list)

### Depends on

- [sc-divider](../divider)
- [sc-empty](../empty)
- [sc-card](../card)
- [sc-stacked-list](../stacked-list)
- [sc-stacked-list-row](../stacked-list-row)
- [sc-skeleton](../skeleton)
- [sc-spacing](../spacing)
- [sc-format-bytes](../../util/format-bytes)
- [sc-icon](../icon)
- [sc-dashboard-module](../dashboard-module)
- [sc-button](../button)
- [sc-block-ui](../block-ui)

### Graph
```mermaid
graph TD;
  sc-purchase-downloads-list --> sc-divider
  sc-purchase-downloads-list --> sc-empty
  sc-purchase-downloads-list --> sc-card
  sc-purchase-downloads-list --> sc-stacked-list
  sc-purchase-downloads-list --> sc-stacked-list-row
  sc-purchase-downloads-list --> sc-skeleton
  sc-purchase-downloads-list --> sc-spacing
  sc-purchase-downloads-list --> sc-format-bytes
  sc-purchase-downloads-list --> sc-icon
  sc-purchase-downloads-list --> sc-dashboard-module
  sc-purchase-downloads-list --> sc-button
  sc-purchase-downloads-list --> sc-block-ui
  sc-empty --> sc-icon
  sc-dashboard-module --> sc-alert
  sc-alert --> sc-icon
  sc-button --> sc-spinner
  sc-block-ui --> sc-spinner
  sc-dashboard-downloads-list --> sc-purchase-downloads-list
  style sc-purchase-downloads-list fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*

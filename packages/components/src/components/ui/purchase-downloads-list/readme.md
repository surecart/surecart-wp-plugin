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
  sc-downloads-list --> sc-divider
  sc-downloads-list --> sc-empty
  sc-downloads-list --> sc-card
  sc-downloads-list --> sc-stacked-list
  sc-downloads-list --> sc-stacked-list-row
  sc-downloads-list --> sc-skeleton
  sc-downloads-list --> sc-spacing
  sc-downloads-list --> sc-format-bytes
  sc-downloads-list --> sc-icon
  sc-downloads-list --> sc-dashboard-module
  sc-downloads-list --> sc-button
  sc-downloads-list --> sc-block-ui
  sc-empty --> sc-icon
  sc-dashboard-module --> sc-alert
  sc-alert --> sc-icon
  sc-button --> sc-spinner
  sc-block-ui --> sc-spinner
  sc-dashboard-downloads-list --> sc-downloads-list
  style sc-downloads-list fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*

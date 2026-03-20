# sc-downloads-list



<!-- Auto Generated Below -->


## Properties

| Property     | Attribute     | Description | Type     | Default                                |
| ------------ | ------------- | ----------- | -------- | -------------------------------------- |
| `customerId` | `customer-id` |             | `string` | `undefined`                            |
| `heading`    | `heading`     |             | `string` | `undefined`                            |
| `productId`  | `product-id`  |             | `string` | `undefined`                            |
| `query`      | `query`       |             | `any`    | `{     page: 1,     per_page: 20,   }` |


## Shadow Parts

| Part     | Description |
| -------- | ----------- |
| `"base"` |             |


## Dependencies

### Depends on

- [sc-icon](../../../ui/icon)
- [sc-card](../../../ui/card)
- [sc-stacked-list](../../../ui/stacked-list)
- [sc-stacked-list-row](../../../ui/stacked-list-row)
- [sc-flex](../../../ui/flex)
- [sc-format-bytes](../../../util/format-bytes)
- [sc-tag](../../../ui/tag)
- [sc-button](../../../ui/button)
- [sc-skeleton](../../../ui/skeleton)
- [sc-divider](../../../ui/divider)
- [sc-empty](../../../ui/empty)
- [sc-dashboard-module](../../../ui/dashboard-module)
- [sc-pagination](../../../ui/pagination)
- [sc-block-ui](../../../ui/block-ui)

### Graph
```mermaid
graph TD;
  sc-downloads-list --> sc-icon
  sc-downloads-list --> sc-card
  sc-downloads-list --> sc-stacked-list
  sc-downloads-list --> sc-stacked-list-row
  sc-downloads-list --> sc-flex
  sc-downloads-list --> sc-format-bytes
  sc-downloads-list --> sc-tag
  sc-downloads-list --> sc-button
  sc-downloads-list --> sc-skeleton
  sc-downloads-list --> sc-divider
  sc-downloads-list --> sc-empty
  sc-downloads-list --> sc-dashboard-module
  sc-downloads-list --> sc-pagination
  sc-downloads-list --> sc-block-ui
  sc-button --> sc-spinner
  sc-empty --> sc-icon
  sc-dashboard-module --> sc-alert
  sc-alert --> sc-icon
  sc-pagination --> sc-flex
  sc-pagination --> sc-button
  sc-pagination --> sc-visually-hidden
  sc-pagination --> sc-icon
  sc-block-ui --> sc-spinner
  style sc-downloads-list fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*

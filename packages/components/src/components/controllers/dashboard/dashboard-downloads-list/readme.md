# ce-customer-subscriptions-list



<!-- Auto Generated Below -->


## Properties

| Property       | Attribute       | Description                        | Type      | Default                                |
| -------------- | --------------- | ---------------------------------- | --------- | -------------------------------------- |
| `allLink`      | `all-link`      |                                    | `string`  | `undefined`                            |
| `heading`      | `heading`       |                                    | `string`  | `undefined`                            |
| `isCustomer`   | `is-customer`   |                                    | `boolean` | `undefined`                            |
| `query`        | `query`         | Customer id to fetch subscriptions | `any`     | `{     page: 1,     per_page: 10,   }` |
| `requestNonce` | `request-nonce` |                                    | `string`  | `undefined`                            |


## Dependencies

### Depends on

- [sc-purchase-downloads-list](../../../ui/purchase-downloads-list)
- [sc-pagination](../../../ui/pagination)

### Graph
```mermaid
graph TD;
  sc-dashboard-downloads-list --> sc-purchase-downloads-list
  sc-dashboard-downloads-list --> sc-pagination
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
  sc-pagination --> sc-flex
  sc-pagination --> sc-button
  style sc-dashboard-downloads-list fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*

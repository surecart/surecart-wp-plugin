# ce-customer-details



<!-- Auto Generated Below -->


## Properties

| Property  | Attribute | Description | Type            | Default     |
| --------- | --------- | ----------- | --------------- | ----------- |
| `heading` | `heading` |             | `string`        | `undefined` |
| `user`    | --        |             | `WordPressUser` | `undefined` |


## Dependencies

### Depends on

- [sc-stacked-list-row](../../../ui/stacked-list-row)
- [sc-dashboard-module](../../../ui/dashboard-module)
- [sc-button](../../../ui/button)
- [sc-icon](../../../ui/icon)
- [sc-card](../../../ui/card)
- [sc-stacked-list](../../../ui/stacked-list)

### Graph
```mermaid
graph TD;
  sc-wordpress-user --> sc-stacked-list-row
  sc-wordpress-user --> sc-dashboard-module
  sc-wordpress-user --> sc-button
  sc-wordpress-user --> sc-icon
  sc-wordpress-user --> sc-card
  sc-wordpress-user --> sc-stacked-list
  sc-dashboard-module --> sc-alert
  sc-alert --> sc-icon
  sc-button --> sc-spinner
  style sc-wordpress-user fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*

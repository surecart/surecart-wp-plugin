# ce-customer-details



<!-- Auto Generated Below -->


## Properties

| Property  | Attribute | Description | Type            | Default     |
| --------- | --------- | ----------- | --------------- | ----------- |
| `heading` | `heading` |             | `string`        | `undefined` |
| `user`    | --        |             | `WordPressUser` | `undefined` |


## Dependencies

### Depends on

- [ce-stacked-list-row](../../../ui/stacked-list-row)
- [ce-dashboard-module](../../../ui/dashboard-module)
- [ce-button](../../../ui/button)
- [ce-icon](../../../ui/icon)
- [ce-card](../../../ui/card)
- [ce-stacked-list](../../../ui/stacked-list)

### Graph
```mermaid
graph TD;
  ce-wordpress-user --> ce-stacked-list-row
  ce-wordpress-user --> ce-dashboard-module
  ce-wordpress-user --> ce-button
  ce-wordpress-user --> ce-icon
  ce-wordpress-user --> ce-card
  ce-wordpress-user --> ce-stacked-list
  ce-dashboard-module --> ce-alert
  ce-alert --> ce-icon
  ce-button --> ce-spinner
  style ce-wordpress-user fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*

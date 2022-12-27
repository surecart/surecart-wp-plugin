# ce-subscription-cancel



<!-- Auto Generated Below -->


## Properties

| Property       | Attribute     | Description | Type                   | Default     |
| -------------- | ------------- | ----------- | ---------------------- | ----------- |
| `backUrl`      | `back-url`    |             | `string`               | `undefined` |
| `heading`      | `heading`     |             | `string`               | `undefined` |
| `protocol`     | --            |             | `SubscriptionProtocol` | `undefined` |
| `subscription` | --            |             | `Subscription`         | `undefined` |
| `successUrl`   | `success-url` |             | `string`               | `undefined` |


## Events

| Event         | Description | Type                |
| ------------- | ----------- | ------------------- |
| `scAbandon`   |             | `CustomEvent<void>` |
| `scCancelled` |             | `CustomEvent<void>` |


## Dependencies

### Used by

 - [sc-cancel-dialog](../sc-cancel-dialog)

### Depends on

- [sc-format-date](../../../util/format-date)
- [sc-skeleton](../../../ui/skeleton)
- [sc-dashboard-module](../../../ui/dashboard-module)
- [sc-flex](../../../ui/flex)
- [sc-button](../../../ui/button)
- [sc-block-ui](../../../ui/block-ui)

### Graph
```mermaid
graph TD;
  sc-subscription-cancel --> sc-format-date
  sc-subscription-cancel --> sc-skeleton
  sc-subscription-cancel --> sc-dashboard-module
  sc-subscription-cancel --> sc-flex
  sc-subscription-cancel --> sc-button
  sc-subscription-cancel --> sc-block-ui
  sc-dashboard-module --> sc-alert
  sc-alert --> sc-icon
  sc-button --> sc-spinner
  sc-block-ui --> sc-spinner
  sc-cancel-dialog --> sc-subscription-cancel
  style sc-subscription-cancel fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*

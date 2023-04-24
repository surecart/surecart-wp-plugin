# sc-cancel-discount



<!-- Auto Generated Below -->


## Properties

| Property       | Attribute | Description | Type                   | Default     |
| -------------- | --------- | ----------- | ---------------------- | ----------- |
| `comment`      | `comment` |             | `string`               | `undefined` |
| `protocol`     | --        |             | `SubscriptionProtocol` | `undefined` |
| `reason`       | --        |             | `CancellationReason`   | `undefined` |
| `subscription` | --        |             | `Subscription`         | `undefined` |


## Events

| Event         | Description | Type                |
| ------------- | ----------- | ------------------- |
| `scCancel`    |             | `CustomEvent<void>` |
| `scPreserved` |             | `CustomEvent<void>` |


## Dependencies

### Used by

 - [sc-cancel-dialog](../sc-cancel-dialog)

### Depends on

- [sc-dashboard-module](../../../ui/dashboard-module)
- [sc-flex](../../../ui/flex)
- [sc-button](../../../ui/button)
- [sc-block-ui](../../../ui/block-ui)

### Graph
```mermaid
graph TD;
  sc-cancel-discount --> sc-dashboard-module
  sc-cancel-discount --> sc-flex
  sc-cancel-discount --> sc-button
  sc-cancel-discount --> sc-block-ui
  sc-dashboard-module --> sc-alert
  sc-alert --> sc-icon
  sc-button --> sc-spinner
  sc-block-ui --> sc-spinner
  sc-cancel-dialog --> sc-cancel-discount
  style sc-cancel-discount fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*

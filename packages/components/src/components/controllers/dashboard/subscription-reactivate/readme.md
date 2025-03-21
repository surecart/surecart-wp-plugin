# sc-subscription-reactivate



<!-- Auto Generated Below -->


## Properties

| Property       | Attribute | Description                    | Type           | Default     |
| -------------- | --------- | ------------------------------ | -------------- | ----------- |
| `open`         | `open`    | Whether it is open             | `boolean`      | `undefined` |
| `subscription` | --        | The subscription to reactivate | `Subscription` | `undefined` |


## Events

| Event            | Description             | Type                                                     |
| ---------------- | ----------------------- | -------------------------------------------------------- |
| `scRefresh`      | Refresh subscriptions   | `CustomEvent<void>`                                      |
| `scRequestClose` | Reactivate modal closed | `CustomEvent<"close-button" \| "keyboard" \| "overlay">` |


## Dependencies

### Used by

 - [sc-subscription](../subscription)

### Depends on

- [sc-flex](../../../ui/flex)
- [sc-skeleton](../../../ui/skeleton)
- [sc-dialog](../../../ui/sc-dialog)
- [sc-dashboard-module](../../../ui/dashboard-module)
- [sc-alert](../../../ui/alert)
- [sc-text](../../../ui/text)
- [sc-button](../../../ui/button)
- [sc-block-ui](../../../ui/block-ui)

### Graph
```mermaid
graph TD;
  sc-subscription-reactivate --> sc-flex
  sc-subscription-reactivate --> sc-skeleton
  sc-subscription-reactivate --> sc-dialog
  sc-subscription-reactivate --> sc-dashboard-module
  sc-subscription-reactivate --> sc-alert
  sc-subscription-reactivate --> sc-text
  sc-subscription-reactivate --> sc-button
  sc-subscription-reactivate --> sc-block-ui
  sc-dialog --> sc-button
  sc-dialog --> sc-icon
  sc-button --> sc-spinner
  sc-dashboard-module --> sc-alert
  sc-alert --> sc-icon
  sc-block-ui --> sc-spinner
  sc-subscription --> sc-subscription-reactivate
  style sc-subscription-reactivate fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*

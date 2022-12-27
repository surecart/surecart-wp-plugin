# sc-cancel-survey



<!-- Auto Generated Below -->


## Properties

| Property   | Attribute | Description | Type                   | Default     |
| ---------- | --------- | ----------- | ---------------------- | ----------- |
| `protocol` | --        |             | `SubscriptionProtocol` | `undefined` |


## Events

| Event            | Description | Type                                                            |
| ---------------- | ----------- | --------------------------------------------------------------- |
| `scAbandon`      |             | `CustomEvent<void>`                                             |
| `scSubmitReason` |             | `CustomEvent<{ reason: CancellationReason; comment: string; }>` |


## Dependencies

### Used by

 - [sc-cancel-dialog](../sc-cancel-dialog)

### Depends on

- [sc-choice](../../../ui/choice)
- [sc-skeleton](../../../ui/skeleton)
- [sc-dashboard-module](../../../ui/dashboard-module)
- [sc-form](../../../ui/form)
- [sc-choices](../../../ui/choices)
- [sc-textarea](../../../ui/sc-textarea)
- [sc-flex](../../../ui/flex)
- [sc-button](../../../ui/button)
- [sc-icon](../../../ui/icon)

### Graph
```mermaid
graph TD;
  sc-cancel-survey --> sc-choice
  sc-cancel-survey --> sc-skeleton
  sc-cancel-survey --> sc-dashboard-module
  sc-cancel-survey --> sc-form
  sc-cancel-survey --> sc-choices
  sc-cancel-survey --> sc-textarea
  sc-cancel-survey --> sc-flex
  sc-cancel-survey --> sc-button
  sc-cancel-survey --> sc-icon
  sc-dashboard-module --> sc-alert
  sc-alert --> sc-icon
  sc-choices --> sc-form-control
  sc-form-control --> sc-tooltip
  sc-textarea --> sc-form-control
  sc-button --> sc-spinner
  sc-cancel-dialog --> sc-cancel-survey
  style sc-cancel-survey fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*

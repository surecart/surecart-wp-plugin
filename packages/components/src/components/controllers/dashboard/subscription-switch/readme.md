# ce-subscription-switch



<!-- Auto Generated Below -->


## Properties

| Property         | Attribute    | Description                        | Type           | Default     |
| ---------------- | ------------ | ---------------------------------- | -------------- | ----------- |
| `heading`        | `heading`    |                                    | `string`       | `undefined` |
| `productGroupId` | --           |                                    | `ProductGroup` | `undefined` |
| `productId`      | `product-id` |                                    | `string`       | `undefined` |
| `query`          | --           | Customer id to fetch subscriptions | `object`       | `undefined` |
| `subscription`   | --           |                                    | `Subscription` | `undefined` |


## Dependencies

### Depends on

- [sc-flex](../../../ui/flex)
- [sc-button](../../../ui/button)
- [sc-choice](../../../ui/choice)
- [sc-skeleton](../../../ui/skeleton)
- [sc-choices](../../../ui/choices)
- [sc-format-number](../../../util/format-number)
- [sc-tag](../../../ui/tag)
- [sc-dashboard-module](../../../ui/dashboard-module)
- [sc-form](../../../ui/form)
- [sc-icon](../../../ui/icon)
- [sc-block-ui](../../../ui/block-ui)

### Graph
```mermaid
graph TD;
  sc-subscription-switch --> sc-flex
  sc-subscription-switch --> sc-button
  sc-subscription-switch --> sc-choice
  sc-subscription-switch --> sc-skeleton
  sc-subscription-switch --> sc-choices
  sc-subscription-switch --> sc-format-number
  sc-subscription-switch --> sc-tag
  sc-subscription-switch --> sc-dashboard-module
  sc-subscription-switch --> sc-form
  sc-subscription-switch --> sc-icon
  sc-subscription-switch --> sc-block-ui
  sc-button --> sc-spinner
  sc-choices --> sc-form-control
  sc-form-control --> sc-tooltip
  sc-dashboard-module --> sc-alert
  sc-alert --> sc-icon
  sc-block-ui --> sc-spinner
  style sc-subscription-switch fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*

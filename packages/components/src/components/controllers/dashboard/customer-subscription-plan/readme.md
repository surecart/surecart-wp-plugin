# ce-customer-subscription



<!-- Auto Generated Below -->


## Properties

| Property       | Attribute | Description | Type           | Default     |
| -------------- | --------- | ----------- | -------------- | ----------- |
| `subscription` | --        |             | `Subscription` | `undefined` |


## Dependencies

### Depends on

- [ce-format-number](../../util/format-number)
- [ce-subscription-status-badge](../../ui/subscription-status-badge)

### Graph
```mermaid
graph TD;
  ce-customer-subscription --> ce-format-number
  ce-customer-subscription --> ce-subscription-status-badge
  ce-subscription-status-badge --> ce-tag
  style ce-customer-subscription fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*

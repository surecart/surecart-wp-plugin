# ce-subscription-status-badge



<!-- Auto Generated Below -->


## Properties

| Property    | Attribute   | Description                                | Type                                                                             | Default     |
| ----------- | ----------- | ------------------------------------------ | -------------------------------------------------------------------------------- | ----------- |
| `clearable` | `clearable` | Makes the tag clearable.                   | `boolean`                                                                        | `false`     |
| `pill`      | `pill`      | Draws a pill-style tag with rounded edges. | `boolean`                                                                        | `false`     |
| `size`      | `size`      | The tag's size.                            | `"large" \| "medium" \| "small"`                                                 | `'medium'`  |
| `status`    | `status`    | The tag's statux type.                     | `"active" \| "canceled" \| "incomplete" \| "past_due" \| "trialing" \| "unpaid"` | `undefined` |


## Dependencies

### Used by

 - [ce-customer-subscription](../../controllers/dashboard/customer-subscription)
 - [ce-customer-subscription-edit](../../controllers/dashboard/customer-subscription-edit)

### Depends on

- [ce-tag](../tag)

### Graph
```mermaid
graph TD;
  ce-subscription-status-badge --> ce-tag
  ce-customer-subscription --> ce-subscription-status-badge
  ce-customer-subscription-edit --> ce-subscription-status-badge
  style ce-subscription-status-badge fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*

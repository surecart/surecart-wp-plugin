# ce-subscription-status-badge



<!-- Auto Generated Below -->


## Properties

| Property    | Attribute   | Description                                | Type                               | Default     |
| ----------- | ----------- | ------------------------------------------ | ---------------------------------- | ----------- |
| `clearable` | `clearable` | Makes the tag clearable.                   | `boolean`                          | `false`     |
| `pill`      | `pill`      | Draws a pill-style tag with rounded edges. | `boolean`                          | `false`     |
| `size`      | `size`      | The tag's size.                            | `"large" \| "medium" \| "small"`   | `'medium'`  |
| `status`    | `status`    | The tag's statux type.                     | `"draft" \| "finalized" \| "paid"` | `undefined` |


## Dependencies

### Used by

 - [ce-customer-order](../../controllers/dashboard/customer-order)
 - [ce-customer-orders-list](../../controllers/dashboard/customer-orders-list)

### Depends on

- [ce-tag](../tag)

### Graph
```mermaid
graph TD;
  ce-order-status-badge --> ce-tag
  ce-customer-order --> ce-order-status-badge
  ce-customer-orders-list --> ce-order-status-badge
  style ce-order-status-badge fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*

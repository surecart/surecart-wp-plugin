# ce-subscription-status-badge



<!-- Auto Generated Below -->


## Properties

| Property    | Attribute   | Description                                | Type                                                                              | Default     |
| ----------- | ----------- | ------------------------------------------ | --------------------------------------------------------------------------------- | ----------- |
| `clearable` | `clearable` | Makes the tag clearable.                   | `boolean`                                                                         | `false`     |
| `pill`      | `pill`      | Draws a pill-style tag with rounded edges. | `boolean`                                                                         | `false`     |
| `size`      | `size`      | The tag's size.                            | `"large" \| "medium" \| "small"`                                                  | `'medium'`  |
| `status`    | `status`    | The tag's statux type.                     | `"delivered" \| "partially_shipped" \| "shipped" \| "unshippable" \| "unshipped"` | `undefined` |


## Dependencies

### Used by

 - [sc-orders-list](../../controllers/dashboard/orders-list)

### Depends on

- [sc-tag](../tag)

### Graph
```mermaid
graph TD;
  sc-order-shipment-badge --> sc-tag
  sc-orders-list --> sc-order-shipment-badge
  style sc-order-shipment-badge fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*

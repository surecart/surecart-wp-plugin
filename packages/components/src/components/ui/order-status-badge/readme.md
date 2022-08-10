# ce-subscription-status-badge



<!-- Auto Generated Below -->


## Properties

| Property    | Attribute   | Description                                | Type                                         | Default     |
| ----------- | ----------- | ------------------------------------------ | -------------------------------------------- | ----------- |
| `clearable` | `clearable` | Makes the tag clearable.                   | `boolean`                                    | `false`     |
| `pill`      | `pill`      | Draws a pill-style tag with rounded edges. | `boolean`                                    | `false`     |
| `size`      | `size`      | The tag's size.                            | `"large" \| "medium" \| "small"`             | `'medium'`  |
| `status`    | `status`    | The tag's statux type.                     | `"paid" \| "payment_failed" \| "processing"` | `undefined` |


## Dependencies

### Used by

 - [sc-invoices-list](../../controllers/dashboard/invoices-list)
 - [sc-order](../../controllers/dashboard/order)
 - [sc-order-confirmation-details](../../controllers/confirmation/order-confirmation-details)
 - [sc-orders-list](../../controllers/dashboard/orders-list)

### Depends on

- [sc-tag](../tag)

### Graph
```mermaid
graph TD;
  sc-order-status-badge --> sc-tag
  sc-invoices-list --> sc-order-status-badge
  sc-order --> sc-order-status-badge
  sc-order-confirmation-details --> sc-order-status-badge
  sc-orders-list --> sc-order-status-badge
  style sc-order-status-badge fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*

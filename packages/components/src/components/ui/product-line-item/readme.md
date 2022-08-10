# ce-product-line-item



<!-- Auto Generated Below -->


## Properties

| Property            | Attribute             | Description                                   | Type      | Default     |
| ------------------- | --------------------- | --------------------------------------------- | --------- | ----------- |
| `amount`            | `amount`              | Product monetary amount                       | `number`  | `undefined` |
| `currency`          | `currency`            | Currency for the product                      | `string`  | `undefined` |
| `editable`          | `editable`            | Can we select the quantity                    | `boolean` | `true`      |
| `imageUrl`          | `image-url`           | Url for the product image                     | `string`  | `undefined` |
| `interval`          | `interval`            | Recurring interval (i.e. monthly, once, etc.) | `string`  | `undefined` |
| `name`              | `name`                | Product name                                  | `string`  | `undefined` |
| `quantity`          | `quantity`            | Quantity                                      | `number`  | `undefined` |
| `removable`         | `removable`           | Is the line item removable                    | `boolean` | `undefined` |
| `trialDurationDays` | `trial-duration-days` | Trial duration days                           | `number`  | `undefined` |


## Events

| Event              | Description                        | Type                  |
| ------------------ | ---------------------------------- | --------------------- |
| `scRemove`         | Emitted when the quantity changes. | `CustomEvent<void>`   |
| `scUpdateQuantity` | Emitted when the quantity changes. | `CustomEvent<number>` |


## Dependencies

### Used by

 - [sc-line-items](../../controllers/checkout-form/line-items)
 - [sc-order](../../controllers/dashboard/order)
 - [sc-order-confirmation-line-items](../../controllers/confirmation/order-confirmation-line-items)
 - [sc-upcoming-invoice](../../controllers/dashboard/upcoming-invoice)

### Depends on

- [sc-format-number](../../util/format-number)
- [sc-quantity-select](../quantity-select)
- [sc-icon](../icon)

### Graph
```mermaid
graph TD;
  sc-product-line-item --> sc-format-number
  sc-product-line-item --> sc-quantity-select
  sc-product-line-item --> sc-icon
  sc-quantity-select --> sc-icon
  sc-line-items --> sc-product-line-item
  sc-order --> sc-product-line-item
  sc-order-confirmation-line-items --> sc-product-line-item
  sc-upcoming-invoice --> sc-product-line-item
  style sc-product-line-item fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*

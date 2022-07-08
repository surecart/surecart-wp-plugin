# ce-line-item



<!-- Auto Generated Below -->


## Properties

| Property   | Attribute  | Description       | Type     | Default     |
| ---------- | ---------- | ----------------- | -------- | ----------- |
| `currency` | `currency` | Currency symbol   | `string` | `undefined` |
| `price`    | `price`    | Price of the item | `string` | `undefined` |


## Slots

| Slot                  | Description                              |
| --------------------- | ---------------------------------------- |
| `"currency"`          | Used for the 3 character currency code.  |
| `"description"`       | Line item description (below the title)  |
| `"image"`             | Line item image                          |
| `"price"`             | Price amount, including currency sign.   |
| `"price-description"` | Description for the price (i.e. monthly) |
| `"title"`             | Line item title.                         |


## Shadow Parts

| Part      | Description |
| --------- | ----------- |
| `"base"`  |             |
| `"image"` |             |
| `"price"` |             |
| `"text"`  |             |


## Dependencies

### Used by

 - [sc-coupon-form](../coupon-form)
 - [sc-line-item-tax](../../controllers/checkout-form/line-item-tax)
 - [sc-line-item-total](../../controllers/checkout-form/line-item-total)
 - [sc-line-items](../../controllers/checkout-form/line-items)
 - [sc-order-confirmation-line-items](../../controllers/confirmation/order-confirmation-line-items)
 - [sc-order-confirmation-totals](../../controllers/confirmation/order-confirmation-totals)
 - [sc-order-summary](../../controllers/checkout-form/order-summary)
 - [sc-upcoming-invoice](../../controllers/dashboard/upcoming-invoice)

### Graph
```mermaid
graph TD;
  sc-coupon-form --> sc-line-item
  sc-line-item-tax --> sc-line-item
  sc-line-item-total --> sc-line-item
  sc-line-items --> sc-line-item
  sc-order-confirmation-line-items --> sc-line-item
  sc-order-confirmation-totals --> sc-line-item
  sc-order-summary --> sc-line-item
  sc-upcoming-invoice --> sc-line-item
  style sc-line-item fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*

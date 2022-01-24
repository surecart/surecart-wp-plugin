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

 - [ce-coupon-form](../../controllers/coupon-form)
 - [ce-line-item-tax](../../controllers/line-item-tax)
 - [ce-line-item-total](../../controllers/line-item-total)
 - [ce-line-items](../../controllers/line-items)
 - [ce-order-confirmation-line-items](../../controllers/order-confirmation-line-items)
 - [ce-order-confirmation-totals](../../controllers/order-confirmation-totals)
 - [ce-order-detail](../../controllers/dashboard/order-detail)
 - [ce-order-summary](../../controllers/order-summary)
 - [ce-product-line-item](../product-line-item)

### Graph
```mermaid
graph TD;
  ce-coupon-form --> ce-line-item
  ce-line-item-tax --> ce-line-item
  ce-line-item-total --> ce-line-item
  ce-line-items --> ce-line-item
  ce-order-confirmation-line-items --> ce-line-item
  ce-order-confirmation-totals --> ce-line-item
  ce-order-detail --> ce-line-item
  ce-order-summary --> ce-line-item
  ce-product-line-item --> ce-line-item
  style ce-line-item fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*

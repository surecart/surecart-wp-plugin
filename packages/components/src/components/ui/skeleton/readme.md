# ce-skeleton



<!-- Auto Generated Below -->


## Properties

| Property | Attribute | Description      | Type                           | Default   |
| -------- | --------- | ---------------- | ------------------------------ | --------- |
| `effect` | `effect`  | Animation effect | `"none" \| "pulse" \| "sheen"` | `'sheen'` |


## Shadow Parts

| Part          | Description |
| ------------- | ----------- |
| `"base"`      |             |
| `"indicator"` |             |


## CSS Custom Properties

| Name              | Description                                                |
| ----------------- | ---------------------------------------------------------- |
| `--border-radius` | The skeleton's border radius.                              |
| `--color`         | The color of the skeleton.                                 |
| `--sheen-color`   | The sheen color when the skeleton is in its loading state. |


## Dependencies

### Used by

 - [ce-coupon-form](../../controllers/coupon-form)
 - [ce-line-item-total](../../controllers/line-item-total)
 - [ce-line-items](../../controllers/line-items)
 - [ce-order-summary](../../controllers/order-summary)
 - [ce-price-choice](../../controllers/price-choice)

### Graph
```mermaid
graph TD;
  ce-coupon-form --> ce-skeleton
  ce-line-item-total --> ce-skeleton
  ce-line-items --> ce-skeleton
  ce-order-summary --> ce-skeleton
  ce-price-choice --> ce-skeleton
  style ce-skeleton fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*

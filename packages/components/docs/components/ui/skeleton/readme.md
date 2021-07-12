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
 - [ce-line-items](../../controllers/line-items)
 - [ce-price-choices](../../controllers/price-chooser)
 - [ce-total](../../controllers/total)

### Graph
```mermaid
graph TD;
  ce-coupon-form --> ce-skeleton
  ce-line-items --> ce-skeleton
  ce-price-choices --> ce-skeleton
  ce-total --> ce-skeleton
  style ce-skeleton fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*

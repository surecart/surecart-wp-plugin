# ce-coupon-form



<!-- Auto Generated Below -->


## Properties

| Property         | Attribute         | Description                   | Type               | Default     |
| ---------------- | ----------------- | ----------------------------- | ------------------ | ----------- |
| `busy`           | `busy`            | Is the form calculating       | `boolean`          | `undefined` |
| `currency`       | `currency`        | Currency                      | `string`           | `undefined` |
| `discount`       | --                | The discount                  | `DiscountResponse` | `undefined` |
| `discountAmount` | `discount-amount` | The discount amount           | `number`           | `undefined` |
| `error`          | `error`           | The error message             | `string`           | `undefined` |
| `forceOpen`      | `force-open`      | Force the form to show        | `boolean`          | `undefined` |
| `label`          | `label`           | The label for the coupon form | `string`           | `undefined` |
| `loading`        | `loading`         | Is the form loading           | `boolean`          | `undefined` |
| `open`           | `open`            | Is it open                    | `boolean`          | `undefined` |


## Events

| Event           | Description                | Type                  |
| --------------- | -------------------------- | --------------------- |
| `scApplyCoupon` | When the coupon is applied | `CustomEvent<string>` |


## Dependencies

### Used by

 - [sc-order-coupon-form](../../controllers/checkout-form/order-coupon-form)
 - [sc-upcoming-invoice](../../controllers/dashboard/upcoming-invoice)

### Depends on

- [sc-skeleton](../skeleton)
- [sc-line-item](../line-item)
- [sc-tag](../tag)
- [sc-format-number](../../util/format-number)
- [sc-input](../input)
- [sc-alert](../alert)
- [sc-button](../button)
- [sc-block-ui](../block-ui)

### Graph
```mermaid
graph TD;
  sc-coupon-form --> sc-skeleton
  sc-coupon-form --> sc-line-item
  sc-coupon-form --> sc-tag
  sc-coupon-form --> sc-format-number
  sc-coupon-form --> sc-input
  sc-coupon-form --> sc-alert
  sc-coupon-form --> sc-button
  sc-coupon-form --> sc-block-ui
  sc-input --> sc-form-control
  sc-form-control --> sc-tooltip
  sc-alert --> sc-icon
  sc-button --> sc-spinner
  sc-block-ui --> sc-spinner
  sc-order-coupon-form --> sc-coupon-form
  sc-upcoming-invoice --> sc-coupon-form
  style sc-coupon-form fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*

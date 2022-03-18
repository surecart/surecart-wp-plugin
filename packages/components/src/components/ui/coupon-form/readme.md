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


## Events

| Event           | Description                | Type                  |
| --------------- | -------------------------- | --------------------- |
| `ceApplyCoupon` | When the coupon is applied | `CustomEvent<string>` |


## Dependencies

### Used by

 - [ce-order-coupon-form](../../controllers/checkout-form/order-coupon-form)
 - [ce-upcoming-invoice](../../controllers/dashboard/upcoming-invoice)

### Depends on

- [ce-skeleton](../skeleton)
- [ce-line-item](../line-item)
- [ce-tag](../tag)
- [ce-format-number](../../util/format-number)
- [ce-input](../input)
- [ce-alert](../alert)
- [ce-button](../button)
- [ce-block-ui](../block-ui)

### Graph
```mermaid
graph TD;
  ce-coupon-form --> ce-skeleton
  ce-coupon-form --> ce-line-item
  ce-coupon-form --> ce-tag
  ce-coupon-form --> ce-format-number
  ce-coupon-form --> ce-input
  ce-coupon-form --> ce-alert
  ce-coupon-form --> ce-button
  ce-coupon-form --> ce-block-ui
  ce-input --> ce-form-control
  ce-form-control --> ce-tooltip
  ce-alert --> ce-icon
  ce-button --> ce-spinner
  ce-block-ui --> ce-spinner
  ce-order-coupon-form --> ce-coupon-form
  ce-upcoming-invoice --> ce-coupon-form
  style ce-coupon-form fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*

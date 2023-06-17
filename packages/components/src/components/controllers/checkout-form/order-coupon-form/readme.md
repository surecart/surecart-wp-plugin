# ce-coupon-form



<!-- Auto Generated Below -->


## Properties

| Property      | Attribute     | Description | Type       | Default     |
| ------------- | ------------- | ----------- | ---------- | ----------- |
| `busy`        | `busy`        |             | `boolean`  | `undefined` |
| `buttonText`  | `button-text` |             | `string`   | `undefined` |
| `collapsed`   | `collapsed`   |             | `boolean`  | `undefined` |
| `error`       | `error`       |             | `any`      | `undefined` |
| `label`       | `label`       |             | `string`   | `undefined` |
| `loading`     | `loading`     |             | `boolean`  | `undefined` |
| `order`       | --            |             | `Checkout` | `undefined` |
| `placeholder` | `placeholder` |             | `string`   | `undefined` |


## Events

| Event           | Description | Type                  |
| --------------- | ----------- | --------------------- |
| `scApplyCoupon` |             | `CustomEvent<string>` |


## Dependencies

### Depends on

- [sc-coupon-form](../../../ui/coupon-form)

### Graph
```mermaid
graph TD;
  sc-order-coupon-form --> sc-coupon-form
  sc-coupon-form --> sc-skeleton
  sc-coupon-form --> sc-line-item
  sc-coupon-form --> sc-tag
  sc-coupon-form --> sc-format-number
  sc-coupon-form --> sc-input
  sc-coupon-form --> sc-button
  sc-coupon-form --> sc-alert
  sc-coupon-form --> sc-block-ui
  sc-coupon-form --> sc-form-control
  sc-input --> sc-form-control
  sc-form-control --> sc-tooltip
  sc-button --> sc-spinner
  sc-alert --> sc-icon
  sc-block-ui --> sc-spinner
  style sc-order-coupon-form fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*

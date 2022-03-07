# ce-coupon-form



<!-- Auto Generated Below -->


## Properties

| Property    | Attribute    | Description | Type      | Default     |
| ----------- | ------------ | ----------- | --------- | ----------- |
| `busy`      | `busy`       |             | `boolean` | `undefined` |
| `error`     | `error`      |             | `any`     | `undefined` |
| `forceOpen` | `force-open` |             | `boolean` | `undefined` |
| `label`     | `label`      |             | `string`  | `undefined` |
| `loading`   | `loading`    |             | `boolean` | `undefined` |
| `order`     | --           |             | `Order`   | `undefined` |


## Events

| Event           | Description | Type                  |
| --------------- | ----------- | --------------------- |
| `ceApplyCoupon` |             | `CustomEvent<string>` |


## Dependencies

### Depends on

- [ce-coupon-form](../../ui/coupon-form)

### Graph
```mermaid
graph TD;
  ce-order-coupon-form --> ce-coupon-form
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
  style ce-order-coupon-form fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*

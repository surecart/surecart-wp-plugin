# ce-coupon-form



<!-- Auto Generated Below -->


## Properties

| Property      | Attribute     | Description | Type      | Default                             |
| ------------- | ------------- | ----------- | --------- | ----------------------------------- |
| `calculating` | `calculating` |             | `boolean` | `undefined`                         |
| `label`       | `label`       |             | `string`  | `undefined`                         |
| `loading`     | --            |             | `Loading` | `{ prices: false, session: false }` |


## Events

| Event           | Description | Type                  |
| --------------- | ----------- | --------------------- |
| `ceApplyCoupon` |             | `CustomEvent<string>` |


## Dependencies

### Depends on

- [ce-skeleton](../../ui/skeleton)
- [ce-input](../../ui/input)
- [ce-button](../../ui/button)
- [ce-block-ui](../../ui/block-ui)

### Graph
```mermaid
graph TD;
  ce-coupon-form --> ce-skeleton
  ce-coupon-form --> ce-input
  ce-coupon-form --> ce-button
  ce-coupon-form --> ce-block-ui
  ce-input --> ce-form-control
  ce-button --> ce-spinner
  ce-block-ui --> ce-spinner
  style ce-coupon-form fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*

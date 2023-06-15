# sc-shipping-choices



<!-- Auto Generated Below -->


## Properties

| Property          | Attribute          | Description                                     | Type               | Default     |
| ----------------- | ------------------ | ----------------------------------------------- | ------------------ | ----------- |
| `label`           | `label`            | The shipping section label                      | `string`           | `undefined` |
| `shippingChoices` | --                 | Shipping choices                                | `ShippingChoice[]` | `[]`        |
| `showDescription` | `show-description` | Whether to show the shipping choice description | `boolean`          | `true`      |


## Events

| Event     | Description | Type                         |
| --------- | ----------- | ---------------------------- |
| `scError` | Error event | `CustomEvent<ResponseError>` |


## Dependencies

### Used by

 - [sc-form-components-validator](../../providers/form-components-validator)

### Depends on

- [sc-form-control](../form-control)
- [sc-radio-group](../radio-group)
- [sc-radio](../radio)
- [sc-flex](../flex)
- [sc-format-number](../../util/format-number)
- [sc-block-ui](../block-ui)

### Graph
```mermaid
graph TD;
  sc-shipping-choices --> sc-form-control
  sc-shipping-choices --> sc-radio-group
  sc-shipping-choices --> sc-radio
  sc-shipping-choices --> sc-flex
  sc-shipping-choices --> sc-format-number
  sc-shipping-choices --> sc-block-ui
  sc-form-control --> sc-tooltip
  sc-block-ui --> sc-spinner
  sc-form-components-validator --> sc-shipping-choices
  style sc-shipping-choices fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*

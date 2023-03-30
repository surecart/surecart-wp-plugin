# sc-product-quantity



<!-- Auto Generated Below -->


## Properties

| Property    | Attribute    | Description                                     | Type                             | Default     |
| ----------- | ------------ | ----------------------------------------------- | -------------------------------- | ----------- |
| `errors`    | `errors`     | Display server-side validation errors.          | `any`                            | `undefined` |
| `help`      | `help`       | Help text                                       | `string`                         | `undefined` |
| `label`     | `label`      | Input label.                                    | `string`                         | `undefined` |
| `name`      | `name`       | Name for the input. Used for validation errors. | `string`                         | `undefined` |
| `required`  | `required`   | Whether the input is required.                  | `boolean`                        | `false`     |
| `showLabel` | `show-label` | Show the label.                                 | `boolean`                        | `true`      |
| `size`      | `size`       | Size of the control                             | `"large" \| "medium" \| "small"` | `'medium'`  |


## Dependencies

### Depends on

- [sc-form-control](../../../ui/form-control)
- [sc-quantity-select](../../../ui/quantity-select)

### Graph
```mermaid
graph TD;
  sc-product-quantity --> sc-form-control
  sc-product-quantity --> sc-quantity-select
  sc-form-control --> sc-tooltip
  sc-quantity-select --> sc-icon
  style sc-product-quantity fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*

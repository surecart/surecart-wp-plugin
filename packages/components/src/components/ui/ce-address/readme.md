# ce-address



<!-- Auto Generated Below -->


## Properties

| Property                  | Attribute  | Description | Type      | Default     |
| ------------------------- | ---------- | ----------- | --------- | ----------- |
| `customerShippingAddress` | --         |             | `Address` | `{}`        |
| `label`                   | `label`    |             | `string`  | `undefined` |
| `loading`                 | `loading`  |             | `boolean` | `undefined` |
| `required`                | `required` |             | `boolean` | `true`      |
| `shippingAddress`         | --         |             | `Address` | `{}`        |


## Shadow Parts

| Part        | Description |
| ----------- | ----------- |
| `"control"` |             |


## Dependencies

### Used by

 - [ce-form-components-validator](../../providers/form-components-validator)

### Depends on

- [ce-input](../input)
- [ce-form-control](../form-control)
- [ce-spacing](../spacing)
- [ce-skeleton](../skeleton)
- [ce-select](../select)

### Graph
```mermaid
graph TD;
  ce-address --> ce-input
  ce-address --> ce-form-control
  ce-address --> ce-spacing
  ce-address --> ce-skeleton
  ce-address --> ce-select
  ce-input --> ce-form-control
  ce-form-control --> ce-tooltip
  ce-select --> ce-menu-label
  ce-select --> ce-menu-item
  ce-select --> ce-form-control
  ce-select --> ce-dropdown
  ce-select --> ce-icon
  ce-select --> ce-input
  ce-select --> ce-spinner
  ce-select --> ce-menu
  ce-form-components-validator --> ce-address
  style ce-address fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*

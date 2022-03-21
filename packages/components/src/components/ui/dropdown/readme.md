# ce-dropdown

<!-- Auto Generated Below -->


## Properties

| Property        | Attribute         | Description                                                                                       | Type                                                           | Default     |
| --------------- | ----------------- | ------------------------------------------------------------------------------------------------- | -------------------------------------------------------------- | ----------- |
| `clickEl`       | --                |                                                                                                   | `HTMLElement`                                                  | `undefined` |
| `closeOnSelect` | `close-on-select` | Determines whether the dropdown should hide when a menu item is selected                          | `boolean`                                                      | `true`      |
| `disabled`      | `disabled`        | Is this disabled.                                                                                 | `boolean`                                                      | `undefined` |
| `open`          | `open`            | Indicates whether or not the dropdown is open. You can use this in lieu of the show/hide methods. | `boolean`                                                      | `false`     |
| `position`      | `position`        | The placement of the dropdown panel                                                               | `"bottom-left" \| "bottom-right" \| "top-left" \| "top-right"` | `undefined` |


## Events

| Event    | Description                                                                                           | Type                |
| -------- | ----------------------------------------------------------------------------------------------------- | ------------------- |
| `scHide` | Emitted when the dropdown closes. Calling `event.preventDefault()` will prevent it from being closed. | `CustomEvent<void>` |
| `scShow` | Emitted when the dropdown opens. Calling `event.preventDefault()` will prevent it from being opened.  | `CustomEvent<void>` |


## Shadow Parts

| Part        | Description |
| ----------- | ----------- |
| `"panel"`   |             |
| `"trigger"` |             |


## Dependencies

### Used by

 - [sc-payment-methods-list](../../controllers/dashboard/payment-methods-list)
 - [sc-quantity-select](../quantity-select)
 - [sc-select](../select)
 - [sc-tax-id-input](../tax-id-input)

### Graph
```mermaid
graph TD;
  sc-payment-methods-list --> sc-dropdown
  sc-quantity-select --> sc-dropdown
  sc-select --> sc-dropdown
  sc-tax-id-input --> sc-dropdown
  style sc-dropdown fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*

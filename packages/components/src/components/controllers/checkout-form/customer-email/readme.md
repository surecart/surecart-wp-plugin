# ce-email



<!-- Auto Generated Below -->


## Properties

| Property                      | Attribute                       | Description                                                                                                                                                                                                   | Type                             | Default     |
| ----------------------------- | ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------- | ----------- |
| `abandonedCheckoutEnabled`    | `abandoned-checkout-enabled`    | Is abandoned checkout enabled?                                                                                                                                                                                | `boolean`                        | `undefined` |
| `autofocus`                   | `autofocus`                     | The input's autofocus attribute.                                                                                                                                                                              | `boolean`                        | `undefined` |
| `customer`                    | --                              | Force a customer.                                                                                                                                                                                             | `Customer`                       | `undefined` |
| `disabled`                    | `disabled`                      | Disables the input.                                                                                                                                                                                           | `boolean`                        | `false`     |
| `hasFocus`                    | `has-focus`                     | Inputs focus                                                                                                                                                                                                  | `boolean`                        | `undefined` |
| `help`                        | `help`                          | The input's help text.                                                                                                                                                                                        | `string`                         | `''`        |
| `invalid`                     | `invalid`                       | This will be true when the control is in an invalid state. Validity is determined by props such as `type`, `required`, `minlength`, `maxlength`, and `pattern` using the browser's constraint validation API. | `boolean`                        | `false`     |
| `label`                       | `label`                         | The input's label.                                                                                                                                                                                            | `string`                         | `undefined` |
| `loggedIn`                    | `logged-in`                     | Is the user logged in.                                                                                                                                                                                        | `boolean`                        | `undefined` |
| `order`                       | --                              | (passed from the sc-checkout component automatically)                                                                                                                                                         | `Checkout`                       | `undefined` |
| `pill`                        | `pill`                          | Draws a pill-style input with rounded edges.                                                                                                                                                                  | `boolean`                        | `false`     |
| `placeholder`                 | `placeholder`                   | The input's placeholder text.                                                                                                                                                                                 | `string`                         | `undefined` |
| `readonly`                    | `readonly`                      | Makes the input readonly.                                                                                                                                                                                     | `boolean`                        | `false`     |
| `required`                    | `required`                      | Makes the input a required field.                                                                                                                                                                             | `boolean`                        | `false`     |
| `showLabel`                   | `show-label`                    | Should we show the label                                                                                                                                                                                      | `boolean`                        | `true`      |
| `size`                        | `size`                          | The input's size.                                                                                                                                                                                             | `"large" \| "medium" \| "small"` | `'medium'`  |
| `trackingConfirmationMessage` | `tracking-confirmation-message` | A message for tracking confirmation.                                                                                                                                                                          | `string`                         | `undefined` |
| `value`                       | `value`                         | The input's value attribute.                                                                                                                                                                                  | `string`                         | `''`        |


## Events

| Event                   | Description                                 | Type                    |
| ----------------------- | ------------------------------------------- | ----------------------- |
| `scBlur`                | Emitted when the control loses focus.       | `CustomEvent<void>`     |
| `scChange`              | Emitted when the control's value changes.   | `CustomEvent<void>`     |
| `scClear`               | Emitted when the clear button is activated. | `CustomEvent<void>`     |
| `scFocus`               | Emitted when the control gains focus.       | `CustomEvent<void>`     |
| `scInput`               | Emitted when the control receives input.    | `CustomEvent<void>`     |
| `scLoginPrompt`         | Prompt for login.                           | `CustomEvent<void>`     |
| `scUpdateAbandonedCart` | Update the abandoned cart.                  | `CustomEvent<boolean>`  |
| `scUpdateOrderState`    | Update the order state.                     | `CustomEvent<Checkout>` |


## Methods

### `reportValidity() => Promise<boolean>`



#### Returns

Type: `Promise<boolean>`




## Dependencies

### Depends on

- [sc-input](../../../ui/input)

### Graph
```mermaid
graph TD;
  sc-customer-email --> sc-input
  sc-input --> sc-form-control
  sc-form-control --> sc-tooltip
  style sc-customer-email fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*

# ce-switch

<!-- Auto Generated Below -->


## Properties

| Property   | Attribute  | Description                                                                                               | Type      | Default     |
| ---------- | ---------- | --------------------------------------------------------------------------------------------------------- | --------- | ----------- |
| `checked`  | `checked`  | Draws the switch in a checked state.                                                                      | `boolean` | `false`     |
| `disabled` | `disabled` | Disables the switch.                                                                                      | `boolean` | `false`     |
| `invalid`  | `invalid`  | This will be true when the control is in an invalid state. Validity is determined by the `required` prop. | `boolean` | `false`     |
| `name`     | `name`     | The switch's name attribute.                                                                              | `string`  | `undefined` |
| `required` | `required` | Makes the switch a required field.                                                                        | `boolean` | `false`     |
| `value`    | `value`    | The switch's value attribute.                                                                             | `string`  | `undefined` |


## Events

| Event      | Description                                       | Type                |
| ---------- | ------------------------------------------------- | ------------------- |
| `ceBlur`   | Emitted when the control loses focus.             | `CustomEvent<void>` |
| `ceChange` | Emitted when the control's checked state changes. | `CustomEvent<void>` |
| `ceFocus`  | Emitted when the control gains focus.             | `CustomEvent<void>` |


## Methods

### `reportValidity() => Promise<boolean>`

Checks for validity and shows the browser's validation message if the control is invalid.

#### Returns

Type: `Promise<boolean>`




## Shadow Parts

| Part            | Description |
| --------------- | ----------- |
| `"base"`        |             |
| `"control"`     |             |
| `"description"` |             |
| `"thumb"`       |             |
| `"title"`       |             |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*

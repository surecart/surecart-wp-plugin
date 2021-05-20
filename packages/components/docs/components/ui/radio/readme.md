# presto-radio



<!-- Auto Generated Below -->


## Properties

| Property   | Attribute  | Description                                                                                               | Type      | Default     |
| ---------- | ---------- | --------------------------------------------------------------------------------------------------------- | --------- | ----------- |
| `checked`  | `checked`  | Draws the radio in a checked state.                                                                       | `boolean` | `false`     |
| `disabled` | `disabled` | Is the radio disabled                                                                                     | `boolean` | `false`     |
| `invalid`  | `invalid`  | This will be true when the control is in an invalid state. Validity is determined by the `required` prop. | `boolean` | `false`     |
| `name`     | `name`     | The radios name attribute                                                                                 | `string`  | `undefined` |
| `required` | `required` | Is this required                                                                                          | `boolean` | `false`     |
| `value`    | `value`    | The radios value                                                                                          | `string`  | `undefined` |


## Events

| Event          | Description                                       | Type                |
| -------------- | ------------------------------------------------- | ------------------- |
| `prestoBlur`   | Emitted when the control loses focus.             | `CustomEvent<void>` |
| `prestoChange` | Emitted when the control's checked state changes. | `CustomEvent<void>` |
| `prestoFocus`  | Emitted when the control gains focus.             | `CustomEvent<void>` |


## Methods

### `prestoClick() => Promise<void>`

Simulates a click on the radio.

#### Returns

Type: `Promise<void>`



### `reportValidity() => Promise<boolean>`

Checks for validity and shows the browser's validation message if the control is invalid.

#### Returns

Type: `Promise<boolean>`




## Shadow Parts

| Part             | Description |
| ---------------- | ----------- |
| `"base"`         |             |
| `"checked-icon"` |             |
| `"control"`      |             |
| `"label"`        |             |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*

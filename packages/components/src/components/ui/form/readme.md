# ce-form



<!-- Auto Generated Below -->


## Properties

| Property     | Attribute    | Description                                                | Type      | Default |
| ------------ | ------------ | ---------------------------------------------------------- | --------- | ------- |
| `novalidate` | `novalidate` | Prevent the form from validating inputs before submitting. | `boolean` | `false` |


## Events

| Event           | Description                                                                                                                                                                                                                                                                                                                                                                                                | Type                  |
| --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------- |
| `ceFormInvalid` | Emitted when the form is invalid.                                                                                                                                                                                                                                                                                                                                                                          | `CustomEvent<Object>` |
| `ceFormSubmit`  | Emitted when the form is submitted. This event will not be emitted if any form control inside of it is in an invalid state, unless the form has the `novalidate` attribute. Note that there is never a need to prevent this event, since it doen't send a GET or POST request like native forms. To "prevent" submission, use a conditional around the XHR request you use to submit the form's data with. | `CustomEvent<Object>` |


## Methods

### `getFormData() => Promise<FormData>`

Serializes all form controls elements and returns a `FormData` object.

#### Returns

Type: `Promise<FormData>`



### `getFormJson() => Promise<{ [k: string]: FormDataEntryValue; }>`



#### Returns

Type: `Promise<{ [k: string]: FormDataEntryValue; }>`



### `submit() => Promise<boolean>`

Submits the form. If all controls are valid, the `ce-submit` event will be emitted and the promise will resolve
with `true`. If any form control is invalid, the promise will resolve with `false` and no event will be emitted.

#### Returns

Type: `Promise<boolean>`



### `validate() => Promise<boolean>`



#### Returns

Type: `Promise<boolean>`




## Shadow Parts

| Part     | Description |
| -------- | ----------- |
| `"base"` |             |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*

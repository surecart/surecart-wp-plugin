# ce-form



<!-- Auto Generated Below -->


## Properties

| Property     | Attribute    | Description                                                | Type      | Default |
| ------------ | ------------ | ---------------------------------------------------------- | --------- | ------- |
| `novalidate` | `novalidate` | Prevent the form from validating inputs before submitting. | `boolean` | `false` |


## Events

| Event          | Description                                                                                                                                                                                                                                                                                                                                                                                                | Type                  |
| -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------- |
| `ceFormChange` | Emitted when the form is submitted. This event will not be emitted if any form control inside of it is in an invalid state, unless the form has the `novalidate` attribute. Note that there is never a need to prevent this event, since it doen't send a GET or POST request like native forms. To "prevent" submission, use a conditional around the XHR request you use to submit the form's data with. | `CustomEvent<Object>` |
| `ceFormSubmit` | Emitted when the form is submitted. This event will not be emitted if any form control inside of it is in an invalid state, unless the form has the `novalidate` attribute. Note that there is never a need to prevent this event, since it doen't send a GET or POST request like native forms. To "prevent" submission, use a conditional around the XHR request you use to submit the form's data with. | `CustomEvent<void>`   |


## Methods

### `getFormData() => Promise<FormData>`

Serializes all form controls elements and returns a `FormData` object.

#### Returns

Type: `Promise<FormData>`



### `getFormJson() => Promise<Record<string, unknown>>`



#### Returns

Type: `Promise<Record<string, unknown>>`



### `submit() => Promise<void>`



#### Returns

Type: `Promise<void>`




## Shadow Parts

| Part     | Description |
| -------- | ----------- |
| `"base"` |             |


## Dependencies

### Used by

 - [ce-customer-edit](../../controllers/dashboard/ce-customer-edit)
 - [ce-login-form](../../controllers/login)
 - [ce-payment-method-create](../../controllers/dashboard/payment-method-create)
 - [ce-subscription-payment](../../controllers/dashboard/ce-subscription-payment)
 - [ce-subscription-switch](../../controllers/dashboard/ce-subscription-switch)
 - [ce-upcoming-invoice](../../controllers/dashboard/upcoming-invoice)

### Graph
```mermaid
graph TD;
  ce-customer-edit --> ce-form
  ce-login-form --> ce-form
  ce-payment-method-create --> ce-form
  ce-subscription-payment --> ce-form
  ce-subscription-switch --> ce-form
  ce-upcoming-invoice --> ce-form
  style ce-form fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*

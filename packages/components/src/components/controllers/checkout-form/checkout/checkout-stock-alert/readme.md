# sc-checkout-stock-alert



<!-- Auto Generated Below -->


## Overview

This component listens for stock requirements and displays a dialog to the user.

## Properties

| Property | Attribute | Description        | Type       | Default     |
| -------- | --------- | ------------------ | ---------- | ----------- |
| `order`  | --        | The current order. | `Checkout` | `undefined` |


## Events

| Event              | Description            | Type                        |
| ------------------ | ---------------------- | --------------------------- |
| `scUpdateLineItem` | Toggle line item event | `CustomEvent<LineItemData>` |


## Dependencies

### Used by

 - [sc-checkout](..)

### Depends on

- [sc-dialog](../../../../ui/sc-dialog)
- [sc-flex](../../../../ui/flex)
- [sc-icon](../../../../ui/icon)
- [sc-text](../../../../ui/text)
- [sc-table](../../../../ui/table)
- [sc-table-cell](../../../../ui/table-cell)
- [sc-table-row](../../../../ui/table-row)
- [sc-button](../../../../ui/button)
- [sc-block-ui](../../../../ui/block-ui)

### Graph
```mermaid
graph TD;
  sc-checkout-stock-alert --> sc-dialog
  sc-checkout-stock-alert --> sc-flex
  sc-checkout-stock-alert --> sc-icon
  sc-checkout-stock-alert --> sc-text
  sc-checkout-stock-alert --> sc-table
  sc-checkout-stock-alert --> sc-table-cell
  sc-checkout-stock-alert --> sc-table-row
  sc-checkout-stock-alert --> sc-button
  sc-checkout-stock-alert --> sc-block-ui
  sc-dialog --> sc-button
  sc-dialog --> sc-icon
  sc-button --> sc-spinner
  sc-block-ui --> sc-spinner
  sc-checkout --> sc-checkout-stock-alert
  style sc-checkout-stock-alert fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*

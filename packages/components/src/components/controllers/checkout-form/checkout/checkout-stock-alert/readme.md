# sc-checkout-stock-alert



<!-- Auto Generated Below -->


## Overview

This component listens for stock requirements and displays a dialog to the user.

## Events

| Event              | Description            | Type                        |
| ------------------ | ---------------------- | --------------------------- |
| `scUpdateLineItem` | Toggle line item event | `CustomEvent<LineItemData>` |


## Dependencies

### Used by

 - [sc-checkout](..)

### Depends on

- [sc-dialog](../../../../ui/sc-dialog)
- [sc-dashboard-module](../../../../ui/dashboard-module)
- [sc-flex](../../../../ui/flex)
- [sc-icon](../../../../ui/icon)
- [sc-card](../../../../ui/card)
- [sc-table](../../../../ui/table)
- [sc-table-cell](../../../../ui/table-cell)
- [sc-table-row](../../../../ui/table-row)
- [sc-button](../../../../ui/button)
- [sc-block-ui](../../../../ui/block-ui)

### Graph
```mermaid
graph TD;
  sc-checkout-stock-alert --> sc-dialog
  sc-checkout-stock-alert --> sc-dashboard-module
  sc-checkout-stock-alert --> sc-flex
  sc-checkout-stock-alert --> sc-icon
  sc-checkout-stock-alert --> sc-card
  sc-checkout-stock-alert --> sc-table
  sc-checkout-stock-alert --> sc-table-cell
  sc-checkout-stock-alert --> sc-table-row
  sc-checkout-stock-alert --> sc-button
  sc-checkout-stock-alert --> sc-block-ui
  sc-dialog --> sc-button
  sc-dialog --> sc-icon
  sc-button --> sc-spinner
  sc-dashboard-module --> sc-alert
  sc-alert --> sc-icon
  sc-block-ui --> sc-spinner
  sc-checkout --> sc-checkout-stock-alert
  style sc-checkout-stock-alert fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*

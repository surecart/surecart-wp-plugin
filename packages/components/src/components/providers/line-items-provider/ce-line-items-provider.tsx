import { convertLineItemsToLineItemData } from '../../../functions/line-items';
import { Order, LineItemData } from '../../../types';
import { Component, h, State, Prop, Watch, Event, EventEmitter, Listen } from '@stencil/core';

@Component({
  tag: 'ce-line-items-provider',
  shadow: true,
})
export class CeLineItemsProvider {
  /** Order Object */
  @Prop() order: Order;

  /** Holds items to sync */
  @State() syncItems: Array<{ type: 'toggle' | 'add' | 'remove' | 'update'; payload: LineItemData }> = [];

  /** Update line items event */
  @Event() ceUpdateLineItems: EventEmitter<Array<LineItemData>>;

  /** Handle line item toggle */
  @Listen('ceToggleLineItem')
  handleLineItemToggle(e: CustomEvent) {
    const lineItem = e.detail as LineItemData;
    this.addSyncItem('toggle', lineItem);
  }

  /** Handle line item remove */
  @Listen('ceRemoveLineItem')
  handleLineItemRemove(e: CustomEvent) {
    const lineItem = e.detail as LineItemData;
    this.addSyncItem('remove', lineItem);
  }

  /** Handle line item add */
  @Listen('ceAddLineItem')
  handleLineItemAdd(e: CustomEvent) {
    const lineItem = e.detail as LineItemData;
    this.addSyncItem('add', lineItem);
  }

  /** Handle line item add */
  @Listen('ceUpdateLineItem')
  handleLineItemUpdate(e: CustomEvent) {
    const lineItem = e.detail as LineItemData;
    this.addSyncItem('update', lineItem);
  }

  /** We listen to the syncItems array and run it on the next render in batch */
  @Watch('syncItems')
  async syncItemsHandler(val) {
    if (!val?.length) return;
    setTimeout(() => {
      if (!this.syncItems?.length) return;
      const items = this.processSyncItems();
      this.ceUpdateLineItems.emit(items);
      this.syncItems = [];
    }, 100);
  }

  /** Add item to sync */
  addSyncItem(type: 'add' | 'remove' | 'toggle' | 'update', payload: LineItemData) {
    this.syncItems = [...this.syncItems, ...[{ type, payload }]];
  }

  /** Batch process items to sync before sending */
  processSyncItems() {
    // get existing line item data.
    let existingData = convertLineItemsToLineItemData(this?.order?.line_items || []);

    const map = {
      toggle: this.toggleItem,
      add: this.addItem,
      remove: this.removeItem,
      update: this.updateItem,
    };

    // run existing data through chain of sync updates.
    (this.syncItems || []).forEach(item => {
      existingData = map[item.type](item.payload, existingData);
    });

    return existingData;
  }

  /** Add item */
  addItem(item: LineItemData, existingLineData: Array<LineItemData>) {
    return [...existingLineData, ...[item]];
  }

  /** Toggle item */
  toggleItem(item: LineItemData, existingLineData: Array<LineItemData>) {
    // find existing item.
    const existingPriceId = existingLineData.find(line => line.price_id === item.price_id)?.price_id;
    // toggle it.
    existingLineData = existingPriceId ? existingLineData.filter(item => existingPriceId !== item.price_id) : [...existingLineData, ...[item]];
    // return.
    return existingLineData;
  }

  /** Remove item */
  removeItem(item: LineItemData, existingLineData: Array<LineItemData>) {
    if (!item.price_id) return existingLineData;
    return existingLineData.filter(data => data.price_id !== item.price_id);
  }

  /** Update the item item */
  updateItem(item: LineItemData, existingLineData: Array<LineItemData>) {
    // find existing item.
    const existingLineItem = existingLineData.findIndex(line => line.price_id === item.price_id);
    // if we found it, update it
    if (existingLineItem !== -1) {
      existingLineData[existingLineItem] = item;
      // otherwise, add it
    } else {
      return [...existingLineData, ...[item]];
    }

    return existingLineData;
  }

  render() {
    return <slot />;
  }
}

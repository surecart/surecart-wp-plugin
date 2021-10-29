import { convertLineItemsToLineItemData } from '../../../functions/line-items';
import { LineItemData, lineItems } from '../../../types';

/** Store the syncItems in memory for the component */
let syncItems: Array<{ type: 'toggle' | 'add' | 'remove'; payload: Array<LineItemData> }> = [];

export const setSyncItems = (items: Array<{ type: 'toggle' | 'add' | 'remove'; payload: Array<LineItemData> }>) => {
  syncItems = items;
  setImmediate(() => {
    const items = processSyncItems();
  });
};

/** Add items */
export const addItems = (items: Array<LineItemData>, existingLineData: Array<LineItemData>) => {
  return [...existingLineData, ...(items || [])];
};

/** Toggle items */
export const toggleItems = (items: Array<LineItemData>, existingLineData: Array<LineItemData>) => {
  // add or remove.
  (items || []).forEach(item => {
    // find existing item.
    const existingPriceId = existingLineData.find(line => line.price_id === item.price_id)?.price_id;
    // toggle it.
    existingLineData = existingPriceId ? existingLineData.filter(item => existingPriceId !== item.price_id) : [...existingLineData, ...[item]];
  });
  return existingLineData;
};

/** Remove items */
export const removeItems = (items: Array<LineItemData>, existingLineData: Array<LineItemData>) => {
  if (!items.length) return existingLineData;
  return existingLineData.filter(data => {
    return !items.find(item => item.price_id === data.price_id);
  });
};

export const processSyncItems = (lineItems: lineItems) => {
  let existingData = convertLineItemsToLineItemData(lineItems);

  const map = {
    toggle: toggleItems,
    add: addItems,
    remove: removeItems,
  };

  (syncItems || []).forEach(item => {
    // run each sync item in order and update the existing data.
    existingData = map[item.type](item.payload, existingData);
  });

  return existingData;
};

// add a sync item to memory
export const addSyncItem = (type: 'add' | 'remove' | 'toggle', payload: Array<LineItemData>) => {
  setSyncItems([...syncItems, ...[{ type, payload }]]);
};

// reset the sync.
export const resetSync = () => {
  setSyncItems([]);
};

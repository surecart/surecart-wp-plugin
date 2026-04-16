import { BundleItem } from '../../types';
import apiFetch from '../../functions/fetch';
import { addQueryArgs } from '@wordpress/url';

const path = 'surecart/v1/bundle_items/';

/**
 * List bundle items for a bundle price.
 */
export const listBundleItems = async (query: Record<string, any> = {}): Promise<Array<BundleItem>> => {
  return (await apiFetch({
    path: addQueryArgs(path, query),
  })) as Array<BundleItem>;
};

/**
 * Get a single bundle item.
 */
export const getBundleItem = async (id: string, query: Record<string, any> = {}): Promise<BundleItem> => {
  return (await apiFetch({
    path: addQueryArgs(`${path}${id}`, query),
  })) as BundleItem;
};

/**
 * Create a bundle item.
 */
export const createBundleItem = async (data: Record<string, any>): Promise<BundleItem> => {
  return (await apiFetch({
    path,
    method: 'POST',
    data: { bundle_item: data },
  })) as BundleItem;
};

/**
 * Update a bundle item.
 */
export const updateBundleItem = async (id: string, data: Record<string, any>): Promise<BundleItem> => {
  return (await apiFetch({
    path: `${path}${id}`,
    method: 'PATCH',
    data: { bundle_item: data },
  })) as BundleItem;
};

/**
 * Delete a bundle item.
 */
export const deleteBundleItem = async (id: string): Promise<{ id: string; deleted: boolean }> => {
  return (await apiFetch({
    path: `${path}${id}`,
    method: 'DELETE',
  })) as { id: string; deleted: boolean };
};

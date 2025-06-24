/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { store as coreStore } from '@wordpress/core-data';
import { useDispatch, select } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import SortableList, { SortableItem } from 'react-easy-sort';
import { addQueryArgs } from '@wordpress/url';
import apiFetch from '@wordpress/api-fetch';
import { ScBlockUi } from '@surecart/components-react';
import { useState } from '@wordpress/element';
import { store as noticesStore } from '@wordpress/notices';
import { createErrorString } from '../../../util';
import arrayMove from 'array-move';

import Price from './Price';

export default ({ prices, product, children, allPrices }) => {
	const [saving, setSaving] = useState(false);
	const { editEntityRecord, receiveEntityRecords } = useDispatch(coreStore);
	const { createErrorNotice, createSuccessNotice } =
		useDispatch(noticesStore);

	const applyDrag = async (oldIndex, newIndex) => {
		if (oldIndex === newIndex) {
			return;
		}

		try {
			setSaving(true);

			// get the sorted result for optimistically updating the UI.
			const result = arrayMove(prices, oldIndex, newIndex);

			// get the price id to update the position via API.
			const { id } = prices.find((price) => price.position === oldIndex);

			// get the base URL from the entity config.
			const baseUrl = select(coreStore).getEntityConfig(
				'surecart',
				'price'
			)?.baseURL;

			// edit entity record to update indexes.
			(result || []).forEach((price, index) =>
				editEntityRecord('surecart', 'price', price.id, {
					position: index,
				})
			);

			// update the single price via API.
			const { product } = await apiFetch({
				method: 'PATCH',
				path: addQueryArgs(`${baseUrl}/${id}`, {
					expand: ['product', 'product.prices'],
				}),
				data: {
					position: newIndex,
				},
			});

			receiveEntityRecords(
				'surecart',
				'price',
				product?.prices?.data || [],
				undefined
			);

			createSuccessNotice(__('Prices updated.', 'surecart'), {
				type: 'snackbar',
			});
		} catch (error) {
			console.error(error);
			createErrorNotice(createErrorString(e), { type: 'snackbar' });
		} finally {
			setSaving(false);
		}
	};

	if (!prices || !prices.length) {
		return children;
	}

	return (
		<div
			css={css`
				position: relative;
			`}
		>
			<SortableList
				onSortEnd={applyDrag}
				draggedItemClassName="sc-dragging"
			>
				{(prices || []).map((price) => {
					return (
						<SortableItem key={price.id}>
							<div>
								<Price
									price={price}
									product={product}
									allPrices={allPrices}
								/>
							</div>
						</SortableItem>
					);
				})}
			</SortableList>
			{saving && <ScBlockUi spinner></ScBlockUi>}
		</div>
	);
};

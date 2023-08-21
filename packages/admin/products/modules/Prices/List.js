/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { store as coreStore } from '@wordpress/core-data';
import { useDispatch } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import SortableList, { SortableItem } from 'react-easy-sort';
import arrayMove from 'array-move';

import Price from './Price';

export default ({ prices, product, children }) => {
	const { editEntityRecord } = useDispatch(coreStore);

	const applyDrag = async (oldIndex, newIndex) => {
		const result = arrayMove(prices, oldIndex, newIndex);
		// edit entity record to update indexes.
		(result || []).forEach((price, index) =>
			editEntityRecord('surecart', 'price', price.id, {
				position: index,
			})
		);
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
			<SortableList onSortEnd={applyDrag}>
				{(prices || []).map((price) => {
					return (
						<SortableItem key={price.id}>
							<div
								css={css`
									padding-top: var(--sc-spacing-x-small);
									padding-bottom: var(--sc-spacing-x-small);
								`}
							>
								<Price price={price} product={product} />
							</div>
						</SortableItem>
					);
				})}
			</SortableList>
		</div>
	);
};

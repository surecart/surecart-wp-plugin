/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { store as coreStore } from '@wordpress/core-data';
import { useDispatch } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import { Container, Draggable } from 'react-smooth-dnd';

import Price from './Price';

export default ({ prices, product, children }) => {
	const { editEntityRecord } = useDispatch(coreStore);

	const applyDrag = async (arr, dragResult) => {
		const { removedIndex, addedIndex, payload } = dragResult;
		if (removedIndex === null && addedIndex === null) return;
		const result = [...arr];
		let itemToAdd = payload;

		if (removedIndex !== null) {
			itemToAdd = result.splice(removedIndex, 1)[0];
		}
		if (addedIndex !== null) {
			result.splice(addedIndex, 0, itemToAdd);
		}
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
				.smooth-dnd-container.vertical > .smooth-dnd-draggable-wrapper {
					overflow: visible;
					padding-top: var(--sc-spacing-x-small);
					padding-bottom: var(--sc-spacing-x-small);
				}
			`}
		>
			<Container
				onDrop={(e) => applyDrag(prices, e)}
				getChildPayload={(index) => prices?.[index]}
				dragHandleSelector=".dragger"
			>
				{(prices || []).map((price) => {
					return (
						<Draggable key={price.id}>
							<Price
								id={price?.id}
								prices={prices}
								product={product}
							/>
						</Draggable>
					);
				})}
			</Container>
		</div>
	);
};

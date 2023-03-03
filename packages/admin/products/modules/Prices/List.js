/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import Price from './Price';
import { Container, Draggable } from 'react-smooth-dnd';
import { select, useDispatch } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import { __ } from '@wordpress/i18n';

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
				position: index + 1,
			})
		);
	};

	if (!prices || !prices.length) {
		return children;
	}

	const sorted = (prices || [])
		.map((price) =>
			select(coreStore).getEditedEntityRecord(
				'surecart',
				'price',
				price?.id
			)
		)
		.sort((a, b) => a?.position - b?.position);

	return (
		<div
			css={css`
				position: relative;
				.smooth-dnd-container.vertical > .smooth-dnd-draggable-wrapper {
					background: #fff;
					overflow: visible;
					margin-top: 0px;
					margin-left: -1px;
					margin-right: -1px;
					margin-bottom: var(--sc-spacing-medium);
				}
			`}
		>
			<Container
				onDrop={(e) => applyDrag(sorted, e)}
				getChildPayload={(index) => sorted?.[index]}
				dragHandleSelector=".dragger"
			>
				{(sorted || []).map((price) => {
					return (
						<Draggable key={price.id}>
							<Price
								id={price?.id}
								prices={sorted}
								product={product}
							/>
						</Draggable>
					);
				})}
			</Container>
		</div>
	);
};

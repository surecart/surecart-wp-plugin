/** @jsx jsx */
import { __ } from '@wordpress/i18n';
import { css, jsx } from '@emotion/core';
import { Button, Modal, Flex } from '@wordpress/components';
import { useState } from '@wordpress/element';
import PriceChoices from '@scripts/blocks/components/PriceChoices';
import { addQueryArgs } from '@wordpress/url';
import { create, insert, isCollapsed, applyFormat } from '@wordpress/rich-text';

export default ({ value, onChange, setAddingLink, addingLink, isActive }) => {
	const initialLineItemsJSON = value?.activeFormats.find(
		(format) => format.type === 'surecart/buy-link'
	)?.attributes?.line_items;
	const initialLineItems = initialLineItemsJSON
		? JSON.parse(initialLineItemsJSON)
		: [{ quantity: 1 }];
	const [line_items, setLineItems] = useState(initialLineItems);

	const removeLineItem = (index) => {
		setLineItems(line_items.filter((_, i) => i !== index));
	};

	const updateLineItem = (data, index) => {
		setLineItems(
			line_items.map((item, i) => {
				if (i !== index) return item;
				return {
					...item,
					...data,
				};
			})
		);
	};

	const addLineItem = () => {
		setLineItems([
			...(line_items || []),
			{
				quantity: 1,
			},
		]);
	};

	const createLink = () => {
		if (!scData?.pages?.checkout) {
			alert('Your checkout page is not set', 'surecart');
			return;
		}

		const url = addQueryArgs(scData?.pages?.checkout, {
			line_items: (line_items || []).map((item) => ({
				price_id: item?.id,
				quantity: item?.quantity,
			})),
		});

		const format = {
			type: 'surecart/buy-link',
			attributes: {
				url,
				line_items: JSON.stringify(line_items),
			},
		};

		if (isCollapsed(value) && !isActive) {
			const toInsert = applyFormat(
				create({ text: url }),
				format,
				0,
				url.length
			);
			onChange(insert(value, toInsert));
		} else {
			onChange(applyFormat(value, format));
		}
		setAddingLink(false);
	};

	return (
		<Modal
			title={__('Create A Buy Link', 'surecart')}
			onRequestClose={() => setAddingLink(false)}
			shouldCloseOnClickOutside={false}
			css={css`
				width: 100%;
				max-width: 800px;
				overflow: visible;
				.components-modal__content {
					overflow: visible;
				}
			`}
		>
			<PriceChoices
				choices={line_items}
				onAddProduct={addLineItem}
				onUpdate={updateLineItem}
				onRemove={removeLineItem}
				onNew={() => {}}
			/>
			<hr />
			<Flex justify="flex-end">
				<Button isTertiary onClick={() => setAddingLink(false)}>
					{__('Cancel', 'surecart')}
				</Button>
				<Button isPrimary onClick={createLink}>
					{__('Insert Buy Link', 'surecart')}
				</Button>
			</Flex>
		</Modal>
	);
};

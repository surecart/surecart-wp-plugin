/** @jsx jsx */
import { __ } from '@wordpress/i18n';
import { css, Global, jsx } from '@emotion/core';
import { Button, Modal, Flex } from '@wordpress/components';
import PriceChoices from '@scripts/blocks/components/PriceChoices';
import { addQueryArgs } from '@wordpress/url';

export default ({ attributes, setAttributes, onChange, setAddingLink }) => {
	const { url, line_items } = attributes;

	const removeLineItem = (index) => {
		setAttributes({ line_items: line_items.filter((_, i) => i !== index) });
	};

	const updateLineItem = (data, index) => {
		setAttributes({
			line_items: line_items.map((item, i) => {
				if (i !== index) return item;
				return {
					...item,
					...data,
				};
			}),
		});
	};

	const addLineItem = () => {
		setAttributes({
			line_items: [
				...(line_items || []),
				{
					quantity: 1,
				},
			],
		});
	};

	const createLink = () => {
		const checkoutPage =
			scBlockData?.pages?.checkout || scData?.pages?.checkout;
		if (!checkoutPage) {
			alert('Your checkout page is not set', 'surecart');
			return;
		}

		const url = addQueryArgs(checkoutPage, {
			line_items: (line_items || []).map((item) => ({
				price_id: item?.id,
				quantity: item?.quantity,
			})),
		});

		onChange({ url, line_items });
		setAddingLink(false);
	};

	return (
		<Modal
			title={__('Add A Buy Link', 'surecart')}
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
			overlayClassName="surecart-price-overlay"
		>
			<Global
				styles={css`
					.components-modal__screen-overlay.surecart-price-overlay {
						z-index: 99999999 !important;
					}
				`}
			/>
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
					{url
						? __('Update Link', 'surecart')
						: __('Add Link', 'surecart')}
				</Button>
			</Flex>
		</Modal>
	);
};

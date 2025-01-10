/** @jsx jsx */
import { css, jsx } from '@emotion/core';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import { Placeholder, Button } from '@wordpress/components';

import { button as icon } from '@wordpress/icons';

import PriceChoices from '@scripts/blocks/components/PriceChoices';
import { updateCartLineItem } from '../../util';
import { ScForm } from '@surecart/components-react';

export default ({
	setAttributes,
	selectedLineItems,
	setShowChangeProducts,
}) => {
	const [line_items, setLineItems] = useState(selectedLineItems || []);

	const removeLineItem = (index) => {
		setLineItems(line_items.filter((_, i) => i !== index));
	};

	const updateLineItem = (data) =>
		setLineItems(updateCartLineItem(data, line_items));

	return (
		<Placeholder icon={icon} label={__('Select some products', 'surecart')}>
			<ScForm onSubmit={(e) => e.preventDefault()}>
				<div
					css={css`
						display: grid;
						gap: 0.5em;
						width: 100%;
					`}
				>
					<PriceChoices
						choices={line_items}
						onUpdate={updateLineItem}
						onRemove={removeLineItem}
						onNew={() => {}}
					/>
					<hr />
					<div
						css={css`
							display: flex;
							justify-content: ${!!selectedLineItems?.length
								? 'space-between'
								: 'flex-end'};
						`}
					>
						{!!selectedLineItems?.length && (
							<Button
								variant="secondary"
								onClick={() => {
									setLineItems([]);
								}}
							>
								{__('Cancel', 'surecart')}
							</Button>
						)}
						<Button
							variant="primary"
							type="submit"
							onClick={() => {
								setAttributes({ line_items });
								setShowChangeProducts(false);
							}}
						>
							{!!selectedLineItems?.length
								? __('Update Buy Button', 'surecart')
								: __('Create Buy Button', 'surecart')}
						</Button>
					</div>
				</div>
			</ScForm>
		</Placeholder>
	);
};

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

export default ({ setAttributes }) => {
	const [line_items, setLineItems] = useState([]);

	const removeLineItem = (index) => {
		setLineItems(line_items.filter((_, i) => i !== index));
	};

	const updateLineItem = (data) =>
		setLineItems(updateCartLineItem(data, line_items));

	return (
		<Placeholder icon={icon} label={__('Select some products', 'surecart')}>
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
						justify-content: flex-end;
					`}
				>
					<Button
						variant="primary"
						onClick={() => setAttributes({ line_items })}
					>
						{__('Create Buy Button', 'surecart')}
					</Button>
				</div>
			</div>
		</Placeholder>
	);
};

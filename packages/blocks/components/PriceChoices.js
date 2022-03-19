/** @jsx jsx */
import { css, jsx } from '@emotion/core';

import { __ } from '@wordpress/i18n';

import PriceChoice from './PriceChoice';
import { CeButton } from '@checkout-engine/components-react';

export default ({ choices, onUpdate, onRemove, onAddProduct, description }) => {
	const renderTable = () => {
		return (
			<ce-card no-padding>
				<ce-table>
					<ce-table-cell slot="head">{__('Product')}</ce-table-cell>
					<ce-table-cell slot="head" style={{ width: '70px' }}>
						{__('Quantity')}
					</ce-table-cell>
					<ce-table-cell style={{ textAlign: 'right' }} slot="head">
						{__('Total')}
					</ce-table-cell>
					<ce-table-cell
						style={{
							width: '100px',
						}}
						slot="head"
					></ce-table-cell>

					{(choices || []).map((choice, index) => {
						return (
							<PriceChoice
								key={index}
								choice={choice}
								onSelect={(id) => onUpdate({ id }, index)}
								onRemove={() => onRemove(index)}
								onUpdate={(data) => onUpdate(data, index)}
							/>
						);
					})}
				</ce-table>
			</ce-card>
		);
	};

	const renderEmpty = () => {
		return (
			<div
				css={css`
					color: var(--ce-color-gray-500);
				`}
			>
				{description
					? description
					: __(
							'To add some default checkout products, click the "Add Products" button.',
							'checkout-engine'
					  )}
			</div>
		);
	};

	return (
		<div
			css={css`
				display: grid;
				gap: 1em;
			`}
		>
			{choices && choices.length > 0 ? renderTable() : renderEmpty()}

			<div
				css={css`
					display: flex;
					gap: 0.5em;
					align-items: center;
				`}
			>
				<CeButton onClick={onAddProduct}>
					<ce-icon name="plus" slot="prefix"></ce-icon>
					{__('Add Product', 'checkout_engine')}
				</CeButton>
			</div>
		</div>
	);
};

/** @jsx jsx */
import { css, jsx } from '@emotion/core';

import { __ } from '@wordpress/i18n';

import PriceChoice from './PriceChoice';
import { ScButton } from '@surecart/components-react';

export default ({ choices, onUpdate, onRemove, onAddProduct, description }) => {
	const renderTable = () => {
		return (
			<sc-card no-padding>
				<sc-table>
					<sc-table-cell slot="head">{__('Product')}</sc-table-cell>
					<sc-table-cell slot="head" style={{ width: '70px' }}>
						{__('Quantity')}
					</sc-table-cell>
					<sc-table-cell style={{ textAlign: 'right' }} slot="head">
						{__('Total')}
					</sc-table-cell>
					<sc-table-cell
						style={{
							width: '100px',
						}}
						slot="head"
					></sc-table-cell>

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
				</sc-table>
			</sc-card>
		);
	};

	const renderEmpty = () => {
		return (
			<div
				css={css`
					color: var(--sc-color-gray-500);
				`}
			>
				{description
					? description
					: __(
							'To add some default checkout products, click the "Add Products" button.',
							'surecart'
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
				<ScButton onClick={onAddProduct}>
					<sc-icon name="plus" slot="prefix"></sc-icon>
					{__('Add Product', 'surecart')}
				</ScButton>
			</div>
		</div>
	);
};

/** @jsx jsx */
import { css, jsx } from '@emotion/core';

import { __ } from '@wordpress/i18n';

import PriceChoice from './PriceChoice';
import { ScButton, ScIcon } from '@surecart/components-react';
import { styles } from '@admin/styles/admin';
import PriceSelector from './PriceSelector';

export default ({ choices, onUpdate, onRemove, description, ...rest }) => {
	const renderTable = () => {
		return (
			<sc-card no-padding>
				<sc-table>
					<sc-table-cell slot="head">{__('Product')}</sc-table-cell>
					<sc-table-cell slot="head" style={{ width: '70px' }}>
						{__('Quantity')}
					</sc-table-cell>
					<sc-table-cell style={{ textAlign: 'center' }} slot="head">
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
			style={styles}
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
				<PriceSelector
					onSelect={({ price_id, variant_id }) =>
						onUpdate({ id: price_id, variant_id })
					}
					requestQuery={{
						archived: false,
					}}
					allowOutOfStockSelection={true}
					{...rest}
				>
					<ScButton slot="trigger" type="default">
						<ScIcon name="plus" slot="prefix" />
						{__('Add Product', 'surecart')}
					</ScButton>
				</PriceSelector>
			</div>
		</div>
	);
};

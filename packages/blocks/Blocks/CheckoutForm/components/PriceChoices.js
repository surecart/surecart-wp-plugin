import { __ } from '@wordpress/i18n';
import { Button } from '@wordpress/components';

import PriceChoice from './PriceChoice';

const headerStyle = {
	borderBottom: '1px solid var(--sc-color-gray-300)',
	borderTop: '1px solid var(--sc-color-gray-300)',
	padding: '0.5em 0',
	fontWeight: 'bold',
	fontSize: '11px',
	textTransform: 'uppercase',
	letterSpacing: '0.05em',
	color: 'var(--sc-color-gray-600)',
	border: 'none',
};

export default ({ choices, onUpdate, onRemove, onAddProduct, description }) => {
	const renderTable = () => {
		return (
			<>
				<style>{`
					.sc-price-choices-table {
						border-spacing: 0;
					}
					.sc-price-choices-table tr td:first-child {
						padding-left: 0;
					}
					.sc-price-choices-table tr td:last-child {
						padding-right: 0;
					}
				`}</style>
				<table className="sc-price-choices-table">
					<thead>
						<tr
							style={{
								textAlign: 'left',
							}}
						>
							<th
								style={{
									...headerStyle,
									width: 'auto',
								}}
							>
								{__('Product', 'surecart')}
							</th>
							<th
								style={{
									...headerStyle,
									maxWidth: '70px',
									width: '70px',
								}}
							>
								{__('Quantity', 'surecart')}
							</th>
							<th
								style={{
									...headerStyle,
									textAlign: 'right',
								}}
							>
								{__('Total', 'surecart')}
							</th>
							<th
								style={{
									...headerStyle,
									width: '0.1%',
									whiteSpace: 'nowrap',
								}}
							></th>
						</tr>
					</thead>

					<tbody>
						{(choices || []).map((choice, index) => {
							return (
								<PriceChoice
									key={index}
									choice={choice}
									onSelect={({price_id}) => onUpdate({ id: price_id }, index)}
									onRemove={() => onRemove(index)}
									onUpdate={(data) => onUpdate(data, index)}
								/>
							);
						})}
					</tbody>
				</table>
			</>
		);
	};

	const renderEmpty = () => {
		return (
			<div
				style={{
					color: 'var(--sc-color-gray-500)',
				}}
			>
				{description
					? description
					: __(
							'To add some products "Add Products" button.',
							'surecart'
					  )}
			</div>
		);
	};

	return (
		<div
			style={{
				display: 'grid',
				gap: '1em',
			}}
		>
			{choices && choices.length > 0 ? renderTable() : renderEmpty()}

			<div
				style={{
					display: 'flex',
					gap: '0.5em',
					alignItems: 'center',
				}}
			>
				<Button isSecondary onClick={onAddProduct}>
					{__('Add Product', 'surecart')}
				</Button>
			</div>
		</div>
	);
};

/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import { DropdownMenu, MenuItem } from '@wordpress/components';
import { moreHorizontal, edit as editIcon, trash } from '@wordpress/icons';
import { SortableKnob } from 'react-easy-sort';

import { ScIcon, ScQuantitySelect } from '@surecart/components-react';

import { productView } from './utils';
import useBundleItemProduct from './useBundleItemProduct';
import Thumb from './Thumb';
import ComponentName from './ComponentName';

export default ({ item, onEdit, onUpdate, onRemove, mixedBasisWarning }) => {
	const product = useBundleItemProduct(item);
	const { name, image, link } = productView(product);

	const commitQty = (raw) => {
		const next = Math.max(1, parseInt(raw, 10) || 1);
		if (next !== item?.quantity) onUpdate({ quantity: next });
	};

	return (
		<div
			css={css`
				padding: 20px 24px;
				background: white;
				border-bottom: 1px solid var(--sc-color-gray-200);
				border-top: 1px solid var(--sc-color-gray-200);
				margin-top: -1px;
			`}
		>
			<div
				css={css`
					display: flex;
					align-items: center;
					gap: 1rem;
					flex-wrap: wrap;
				`}
			>
				<SortableKnob>
					<ScIcon
						name="drag"
						css={css`
							font-size: 16px;
							cursor: grab;
							color: var(--sc-color-gray-400);
						`}
					/>
				</SortableKnob>

				<Thumb src={image} />

				<div
					css={css`
						flex: 1 1 200px;
						min-width: 0;
					`}
				>
					<ComponentName name={name} link={link} />
					{mixedBasisWarning && (
						<div
							css={css`
								color: var(--sc-color-warning-700, #b45309);
								font-size: 12px;
								margin-top: 4px;
							`}
						>
							{__(
								'No basis amount set — this component will be allocated $0 for tax.',
								'surecart'
							)}
						</div>
					)}
				</div>

				<div
					aria-label={__('Quantity', 'surecart')}
					css={css`
						flex-shrink: 0;
					`}
				>
					<ScQuantitySelect
						min={1}
						size="small"
						quantity={Number(item?.quantity) || 1}
						productName={name}
						onScChange={(e) => commitQty(e.detail)}
					/>
				</div>

				<DropdownMenu
					icon={moreHorizontal}
					label={__('More Actions', 'surecart')}
					popoverProps={{ placement: 'bottom-end' }}
					menuProps={{ style: { minWidth: '150px' } }}
				>
					{({ onClose }) => (
						<>
							<MenuItem
								icon={editIcon}
								iconPosition="left"
								onClick={() => {
									onEdit();
									onClose();
								}}
							>
								{__('Edit', 'surecart')}
							</MenuItem>
							<MenuItem
								icon={trash}
								iconPosition="left"
								onClick={() => {
									onRemove();
									onClose();
								}}
							>
								{__('Remove', 'surecart')}
							</MenuItem>
						</>
					)}
				</DropdownMenu>
			</div>
		</div>
	);
};

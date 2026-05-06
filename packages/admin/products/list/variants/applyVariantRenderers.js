/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import { Button, Spinner } from '@wordpress/components';
import { Icon, chevronDown, chevronRight } from '@wordpress/icons';
import { __, _n, sprintf } from '@wordpress/i18n';
import { ScTag } from '@surecart/components-react';

import {
	isVariantRow,
	productHasVariants,
	getActiveVariantCount,
	getVariantOriginalId,
} from './injectVariantRows';
import VariantImageCell from './VariantImageCell';
import VariantNameCell from './VariantNameCell';
import VariantPriceCell from './VariantPriceCell';
import VariantSkuCell from './VariantSkuCell';
import VariantQuantityCell from './VariantQuantityCell';

// field id → variant cell. Missing ids render an em dash on variants.
const VARIANT_CELLS = {
	media: VariantImageCell,
	name: VariantNameCell,
	display_name: VariantNameCell,
	price: VariantPriceCell,
	sku: VariantSkuCell,
	quantity: VariantQuantityCell,
};

const VariantBlankCell = () => (
	<span
		className="sc-variant-cell"
		css={css`
			color: var(--sc-color-gray-300);
		`}
	>
		—
	</span>
);

const ChevronToggle = ({ isExpanded, onToggle, label }) => (
	<Button
		size="small"
		variant="tertiary"
		onClick={(e) => {
			e.stopPropagation();
			onToggle();
		}}
		aria-expanded={isExpanded}
		aria-label={
			isExpanded
				? __('Collapse variants', 'surecart')
				: __('Expand variants', 'surecart')
		}
		css={css`
			padding: 0 !important;
			min-width: 24px !important;
			height: 24px !important;
			color: var(--sc-color-gray-500) !important;
			margin-right: 4px;
			flex: none;
			&:hover {
				color: var(--sc-color-gray-900) !important;
			}
		`}
	>
		<Icon icon={isExpanded ? chevronDown : chevronRight} size={20} />
		<span className="screen-reader-text">{label}</span>
	</Button>
);

const ChevronSpacer = () => (
	<span
		aria-hidden="true"
		css={css`
			display: inline-block;
			width: 28px;
			flex: none;
		`}
	/>
);

const VariantCountBadge = ({ count }) => (
	<ScTag
		css={css`
			flex: none;
			margin-left: 8px;
		`}
		title={sprintf(
			/* translators: %d is the number of variants on the product. */
			_n('%d variant', '%d variants', count, 'surecart'),
			count
		)}
	>
		{count}
	</ScTag>
);

// Wrap (don't patch) `name.js` so plugins extending the original
// field continue to work. Adds the chevron in front of the name cell.
const decorateNameField = (field, { expandedIds, onToggle }) => {
	const originalRender = field.render;
	return {
		...field,
		render: (props) => {
			const { item } = props;
			if (!productHasVariants(item)) {
				return (
					<div
						css={css`
							display: flex;
							align-items: center;
							min-width: 0;
						`}
					>
						<ChevronSpacer />
						{originalRender(props)}
					</div>
				);
			}
			const isExpanded = expandedIds.has(item?.id);
			const variantCount = getActiveVariantCount(item);
			return (
				<div
					css={css`
						display: flex;
						align-items: center;
						min-width: 0;
					`}
				>
					<ChevronToggle
						isExpanded={isExpanded}
						onToggle={() => onToggle(item.id)}
						label={item?.name}
					/>
					{originalRender(props)}
					{variantCount > 0 && (
						<VariantCountBadge count={variantCount} />
					)}
				</div>
			);
		},
	};
};

// Variant rows route to their own renderer; product rows pass through.
// `getValue` is zeroed for variants so they don't accidentally
// participate in any future client-side sort/search aggregation.
const decorateForVariants = (field, { savingVariantIds }) => {
	const originalRender = field.render;
	const originalGetValue = field.getValue;
	const VariantCell = VARIANT_CELLS[field.id] || VariantBlankCell;

	return {
		...field,
		render: (props) => {
			if (!isVariantRow(props.item)) {
				return originalRender ? originalRender(props) : null;
			}
			const isSaving = savingVariantIds?.has(
				getVariantOriginalId(props.item)
			);
			const cell = <VariantCell {...props} />;
			if (!isSaving) return cell;
			// Dim the cell + show a small spinner on the name cell only
			// (one indicator per row is enough; multiple looks busy).
			return (
				<div
					css={css`
						display: flex;
						align-items: center;
						gap: 8px;
						opacity: 0.55;
						pointer-events: none;
						transition: opacity 0.15s ease-out;
					`}
				>
					{cell}
					{(field.id === 'name' || field.id === 'display_name') && (
						<Spinner
							css={css`
								margin: 0;
								flex: none;
							`}
						/>
					)}
				</div>
			);
		},
		getValue: (props) => {
			if (isVariantRow(props.item)) return '';
			return originalGetValue ? originalGetValue(props) : '';
		},
	};
};

// Wraps each field so variant rows render their own cells, and
// injects the expand/collapse chevron into the `name` field.
//
// Variant features (chevron, badge, sub-rows, cell renderers) are
// inherently tabular — they only make sense in table view. In grid
// and list layouts we strip the thumbnail from the `name` field so
// it doesn't double up with the card's mediaField, and otherwise
// pass fields through untouched.
export default function applyVariantRenderers(
	fields,
	{ expandedIds, onToggle, savingVariantIds, viewType = 'table' }
) {
	if (viewType !== 'table') {
		return fields.map((field) =>
			field.id === 'name'
				? { ...field, render: ({ item }) => item?.name || '' }
				: field
		);
	}

	return fields.map((field) => {
		const variantAware = decorateForVariants(field, { savingVariantIds });
		if (field.id === 'name') {
			return decorateNameField(variantAware, { expandedIds, onToggle });
		}
		return variantAware;
	});
}

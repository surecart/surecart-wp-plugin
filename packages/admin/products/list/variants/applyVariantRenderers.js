/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import { Button, ProgressBar, Spinner } from '@wordpress/components';
import { Icon, chevronDown, chevronRight } from '@wordpress/icons';
import { __ } from '@wordpress/i18n';

import {
	isVariantRow,
	isVariantPlaceholder,
	productHasVariants,
	productHasVariantOptions,
	getVariantParent,
	getVariantOriginalId,
	VARIANT_PLACEHOLDER,
} from './injectVariantRows';
import VARIANT_CELLS from './cells';

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

// Wrap (don't patch) `name.js` so plugins extending the original
// field continue to work. Adds the chevron in front of the name cell.
// Variant data loads lazily on expand, so option definitions (always in
// the lean list response) decide whether a chevron shows; loaded variants
// keep it for full-expand responses.
const decorateNameField = (field, { expandedIds, onToggle }) => {
	const originalRender = field.render;
	return {
		...field,
		render: (props) => {
			const { item } = props;
			if (!productHasVariantOptions(item) && !productHasVariants(item)) {
				return (
					<div
						className="sc-product-name-row"
						css={css`
							display: flex;
							align-items: center;
							min-width: 0;
							width: 100%;
						`}
					>
						<ChevronSpacer />
						{originalRender(props)}
					</div>
				);
			}
			const isExpanded = expandedIds.has(item?.id);
			return (
				<div
					className="sc-product-name-row"
					css={css`
						display: flex;
						align-items: center;
						min-width: 0;
						width: 100%;
					`}
				>
					<ChevronToggle
						isExpanded={isExpanded}
						onToggle={() => onToggle(item.id)}
						label={item?.name}
					/>
					{originalRender(props)}
				</div>
			);
		},
	};
};

// Single-cell content for the lazy-fetch placeholder rows. Rendered in the
// name cell only; every other cell stays empty.
const PlaceholderCell = ({ item, onRetry }) => {
	if (item[VARIANT_PLACEHOLDER] === 'error') {
		return (
			<div
				css={css`
					display: flex;
					align-items: center;
					gap: 8px;
					color: var(--sc-color-gray-600);
				`}
			>
				{__('Failed to load variants.', 'surecart')}
				<Button
					size="small"
					variant="link"
					onClick={(e) => {
						e.stopPropagation();
						onRetry?.(getVariantParent(item)?.id);
					}}
				>
					{__('Retry', 'surecart')}
				</Button>
			</div>
		);
	}
	return (
		<div
			css={css`
				display: flex;
				align-items: center;
				gap: 8px;
				color: var(--sc-color-gray-600);
			`}
		>
			{/* <Spinner
				css={css`
					margin: 0;
					flex: none;
				`}
			/> */}
			<ProgressBar />
			{/* {__('Loading variants…', 'surecart')} */}
		</div>
	);
};

// Variant rows route to their own renderer; product rows pass through.
// `getValue` is zeroed for variants so they don't accidentally
// participate in any future client-side sort/search aggregation.
const decorateForVariants = (field, { savingVariantIds, onRetry }) => {
	const originalRender = field.render;
	const originalGetValue = field.getValue;
	const VariantCell = VARIANT_CELLS[field.id] || (() => null);

	return {
		...field,
		render: (props) => {
			if (!isVariantRow(props.item)) {
				return originalRender ? originalRender(props) : null;
			}
			if (isVariantPlaceholder(props.item)) {
				if (field.id === 'name' || field.id === 'display_name') {
					return (
						<PlaceholderCell item={props.item} onRetry={onRetry} />
					);
				}
				return null;
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

const compose =
	(...fns) =>
	(input) =>
		fns.reduce((acc, fn) => fn(acc), input);

const getDecorators = (field, ctx) => {
	const { expandedIds, onToggle, savingVariantIds, onRetry } = ctx;
	const decorators = [
		(f) => decorateForVariants(f, { savingVariantIds, onRetry }),
	];
	if (field.id === 'name') {
		decorators.push((f) => decorateNameField(f, { expandedIds, onToggle }));
	}
	return decorators;
};

export default function applyVariantRenderers(fields, ctx) {
	return fields.map((field) => compose(...getDecorators(field, ctx))(field));
}

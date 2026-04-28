/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import { ScInput, ScSelect } from '@surecart/components-react';

const DIMENSIONS_UNIT_TYPES = [
	{
		label: __('in', 'surecart'),
		value: 'in',
	},
	{
		label: __('ft', 'surecart'),
		value: 'ft',
	},
	{
		label: __('cm', 'surecart'),
		value: 'cm',
	},
	{
		label: __('mm', 'surecart'),
		value: 'mm',
	},
	{
		label: __('m', 'surecart'),
		value: 'm',
	},
];

export default ({ dimensions, updateDimensions, hideHeight = false, required = false }) => {
	const { length, width, height, unit } = dimensions || {};

	return (
		<div
			css={css`
				width: 100%;
				display: flex;
				gap: var(--sc-spacing-small);
				flex-wrap: wrap;
				align-items: flex-end;
			`}
		>
			<ScInput
				css={css`
					flex: 1;
				`}
				label={__('Length', 'surecart')}
				value={length}
				type="number"
				step={0.01}
				placeholder="0"
				min={required ? '0.01' : '0'}
				max="999999"
				required={required}
				onScInput={(e) =>
					updateDimensions({
						dimensions: {
							...dimensions,
							length: e.target.value,
						},
					})
				}
			/>
			<ScInput
				css={css`
					flex: 1;
				`}
				label={__('Width', 'surecart')}
				value={width}
				type="number"
				step={0.01}
				placeholder="0"
				min={required ? '0.01' : '0'}
				max="999999"
				required={required}
				onScInput={(e) =>
					updateDimensions({
						dimensions: {
							...dimensions,
							width: e.target.value,
						},
					})
				}
			/>
			{!hideHeight && (
				<ScInput
					css={css`
						flex: 1;
					`}
					label={__('Height', 'surecart')}
					value={height}
					type="number"
					step={0.01}
					placeholder="0"
					min={required ? '0.01' : '0'}
					max="999999"
					required={required}
					onScInput={(e) =>
						updateDimensions({
							dimensions: {
								...dimensions,
								height: e.target.value,
							},
						})
					}
				/>
			)}
			<ScSelect
				unselect={false}
				value={unit ?? 'cm'}
				css={css`
					flex: 1;
				`}
				onScChange={(e) =>
					updateDimensions({
						dimensions: {
							...dimensions,
							unit: e.target.value,
						},
					})
				}
				choices={DIMENSIONS_UNIT_TYPES}
				placeholder={__('Unit', 'surecart')}
			/>
		</div>
	);
};

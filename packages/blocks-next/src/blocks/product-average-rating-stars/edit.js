/**
 * WordPress dependencies.
 */
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, RangeControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies.
 */
import ColorInspectorControl from '../../components/ColorInspectorControl';

export default ({ attributes, setAttributes, clientId }) => {
	const { fill_color, empty_color, size } = attributes;

	const blockProps = useBlockProps();

	const rating = 4.5;
	const stars = [];

	for (let i = 1; i <= 5; i++) {
		const difference = rating - (i - 1);
		let fillPercentage = 0;

		if (difference >= 1) {
			fillPercentage = 100;
		} else if (difference > 0) {
			fillPercentage = Math.round(difference * 100);
		}

		const gradientId = `star-gradient-editor-${i}`;

		stars.push(
			<div
				className="star-container"
				key={i}
				style={{ width: `${size}px`, height: `${size}px` }}
			>
				<svg className="star-svg" viewBox="0 0 24 24">
					<defs>
						<linearGradient id={gradientId}>
							<stop
								offset={`${fillPercentage}%`}
								stopColor={fill_color || 'var(--sc-color-primary-500)'}
							/>
							<stop
								offset={`${fillPercentage}%`}
								stopColor={empty_color || '#d1d5db'}
							/>
						</linearGradient>
					</defs>
					<polygon
						points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
						fill={`url(#${gradientId})`}
						stroke={fill_color || 'var(--sc-color-primary-500)'}
						strokeWidth="1"
					/>
				</svg>
			</div>
		);
	}

	return (
		<>
			<InspectorControls>
				<PanelBody title={__('Appearance', 'surecart')}>
					<RangeControl
						label={__('Size', 'surecart')}
						value={size}
						onChange={(value) => setAttributes({ size: value })}
						min={10}
						max={100}
					/>
				</PanelBody>
			</InspectorControls>
			<ColorInspectorControl
				settings={[
					{
						colorValue: fill_color,
						label: __('Fill Color', 'surecart'),
						onColorChange: (color) =>
							setAttributes({ fill_color: color }),
						resetAllFilter: () =>
							setAttributes({ fill_color: undefined }),
					},
					{
						colorValue: empty_color,
						label: __('Empty Color', 'surecart'),
						onColorChange: (color) =>
							setAttributes({ empty_color: color }),
						resetAllFilter: () =>
							setAttributes({ empty_color: undefined }),
					},
				]}
				panelId={clientId}
			/>
			<div {...blockProps}>{stars}</div>
		</>
	);
};

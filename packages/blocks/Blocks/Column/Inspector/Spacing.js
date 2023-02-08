/**
 * WordPress dependencies
 */
import {
	__experimentalUseCustomUnits as useCustomUnits,
	__experimentalUnitControl as UnitControl,
	__experimentalToggleGroupControl as ToggleGroupControl,
	__experimentalToggleGroupControlOptionIcon as ToggleGroupControlOptionIcon,
	ToggleControl,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useSetting } from '@wordpress/block-editor';
import {
	Icon,
	positionCenter,
	stretchWide,
	justifyLeft,
	justifyCenter,
	justifyRight,
} from '@wordpress/icons';

export default ({ attributes, setAttributes }) => {
	const { layout } = attributes;
	const { wideSize, contentSize, justifyContent = 'center' } = layout || {};

	console.log(layout);
	const onChange = (layout) => setAttributes({ layout });
	const onJustificationChange = (value) => {
		onChange({
			...layout,
			justifyContent: value,
		});
	};

	const justificationOptions = [
		{
			value: 'left',
			icon: justifyLeft,
			label: __('Justify items left'),
		},
		{
			value: 'center',
			icon: justifyCenter,
			label: __('Justify items center'),
		},
		{
			value: 'right',
			icon: justifyRight,
			label: __('Justify items right'),
		},
	];

	const units = useCustomUnits({
		availableUnits: useSetting('spacing.units') || [
			'%',
			'px',
			'em',
			'rem',
			'vw',
		],
	});

	return (
		<>
			<ToggleControl
				className="block-editor-hooks__toggle-control"
				label={__('Inner blocks use content width')}
				checked={layout?.type === 'constrained'}
				onChange={() =>
					setAttributes({
						layout: {
							type:
								layout?.type === 'constrained'
									? 'default'
									: 'constrained',
						},
					})
				}
				help={
					layout?.type === 'constrained'
						? __(
								'Nested blocks use content width with options for full and wide widths.'
						  )
						: __(
								'Nested blocks will fill the width of this container. Toggle to constrain.'
						  )
				}
			/>

			{layout?.type === 'constrained' && (
				<>
					<div className="block-editor-hooks__layout-controls">
						<div className="block-editor-hooks__layout-controls-unit">
							<UnitControl
								label={__('Content')}
								labelPosition="top"
								__unstableInputWidth="80px"
								value={contentSize || wideSize || ''}
								onChange={(nextWidth) => {
									nextWidth =
										0 > parseFloat(nextWidth)
											? '0'
											: nextWidth;
									onChange({
										...layout,
										contentSize: nextWidth,
									});
								}}
								units={units}
							/>
							<Icon icon={positionCenter} />
						</div>
						<div className="block-editor-hooks__layout-controls-unit">
							<UnitControl
								label={__('Wide')}
								labelPosition="top"
								__unstableInputWidth="80px"
								value={wideSize || contentSize || ''}
								onChange={(nextWidth) => {
									nextWidth =
										0 > parseFloat(nextWidth)
											? '0'
											: nextWidth;
									onChange({
										...layout,
										wideSize: nextWidth,
									});
								}}
								units={units}
							/>
							<Icon icon={stretchWide} />
						</div>
					</div>
					<p className="block-editor-hooks__layout-controls-helptext">
						{__(
							'Customize the width for all elements that are assigned to the center or wide columns.'
						)}
					</p>
					<ToggleGroupControl
						__experimentalIsBorderless
						label={__('Justification')}
						value={justifyContent}
						onChange={onJustificationChange}
					>
						{justificationOptions.map(({ value, icon, label }) => {
							return (
								<ToggleGroupControlOptionIcon
									key={value}
									value={value}
									icon={icon}
									label={label}
								/>
							);
						})}
					</ToggleGroupControl>
				</>
			)}
		</>
	);
};

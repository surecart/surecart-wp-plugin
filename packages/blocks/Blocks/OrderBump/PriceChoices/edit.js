import { ScChoices, ScPriceChoiceContainer } from '@surecart/components-react';
import {
	InspectorControls,
	useBlockProps,
	__experimentalUseBorderProps as useBorderProps,
	__experimentalUseColorProps as useColorProps,
	__experimentalGetSpacingClassesAndStyles as useSpacingProps,
} from '@wordpress/block-editor';
import {
	Notice,
	PanelBody,
	PanelRow,
	RangeControl,
	TextControl,
	ToggleControl,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';

export default ({ attributes, setAttributes, context }) => {
	const { label, columns, show_price } = attributes;
	const blockProps = useBlockProps({
		label,
		showPrice: show_price,
	});

	const borderProps = useBorderProps(attributes);
	const colorProps = useColorProps(attributes);
	const spacingProps = useSpacingProps(attributes);

	return (
		<>
			<InspectorControls>
				<PanelBody>
					<RangeControl
						label={__('Columns', 'surecart')}
						value={columns}
						onChange={(columns) => setAttributes({ columns })}
						min={1}
						max={Math.max(3, columns)}
					/>
					{columns > 3 && (
						<Notice status="warning" isDismissible={false}>
							{__(
								'This column count exceeds the recommended amount and may cause visual breakage.'
							)}
						</Notice>
					)}
					<PanelRow>
						<ToggleControl
							label={__('Show Price', 'surecart')}
							checked={show_price}
							onChange={() =>
								setAttributes({ show_price: !show_price })
							}
						/>
					</PanelRow>
					<PanelRow>
						<TextControl
							label={__('Label', 'surecart')}
							value={label}
							onChange={(label) => setAttributes({ label })}
						/>
					</PanelRow>
				</PanelBody>
			</InspectorControls>

			<div {...blockProps}>
				<ScChoices
					label={label}
					required
					style={{
						'--columns': columns,
						border: 'none',
						'--sc-input-required-indicator': '/\\00a0',
						'--sc-choice-text-color': colorProps?.style?.color,
						'--sc-choice-background-color':
							colorProps?.style?.backgroundColor,
						'--sc-choice-border-color':
							borderProps?.style?.borderColor,
						'--sc-choice-border-width':
							borderProps?.style?.borderWidth,
						'--sc-choice-border-radius':
							borderProps?.style?.borderRadius,
						'--sc-choice-padding-left':
							spacingProps?.style?.paddingLeft,
						'--sc-choice-padding-right':
							spacingProps?.style?.paddingRight,
						'--sc-choice-padding-top':
							spacingProps?.style?.paddingTop,
						'--sc-choice-padding-bottom':
							spacingProps?.style?.paddingBottom,
						marginTop: spacingProps?.style?.marginTop,
						marginLeft: spacingProps?.style?.marginLeft,
						marginRight: spacingProps?.style?.marginRight,
						marginBottom: spacingProps?.style?.marginBottom,
					}}
				>
					<ScPriceChoiceContainer
						label={__('One Time', 'surecart')}
						showPrice={!!show_price}
						price={JSON.stringify({
							amount: 1900,
							currency: scData?.currency,
						})}
						checked={true}
					/>
					<ScPriceChoiceContainer
						label={__('Subscribe and Save', 'surecart')}
						showPrice={!!show_price}
						price={JSON.stringify({
							amount: 1400,
							currency: scData?.currency,
							recurring_interval_count: 1,
							recurring_interval: 'month',
						})}
					/>
					{columns > 2 && (
						<ScPriceChoiceContainer
							label={__('Payment Plan', 'surecart')}
							show-price={!!show_price}
							price={JSON.stringify({
								amount: 12000,
								currency: scData?.currency,
								recurring_interval_count: 1,
								recurring_interval: 'month',
								recurring_period_count: 6,
							})}
						/>
					)}
				</ScChoices>
			</div>
		</>
	);
};

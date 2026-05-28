/**
 * WordPress dependencies.
 */
import {
	useBlockProps,
	PlainText,
	InspectorControls,
	__experimentalUseBorderProps as useBorderProps,
	__experimentalUseColorProps as useColorProps,
	__experimentalGetSpacingClassesAndStyles as useSpacingProps,
	__experimentalGetShadowClassesAndStyles as useShadowProps,
} from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import classnames from 'classnames';

/**
 * Internal dependencies.
 */
import ScIcon from '../../components/ScIcon';
import Design from './design';
import { getSpacingPresetCssVar } from '../../../../blocks/util';

export default ({ attributes, setAttributes }) => {
	const { icon, button_type, label, style, width, icon_position, icon_size } =
		attributes;

	const borderProps = useBorderProps(attributes);
	const colorProps = useColorProps(attributes);
	const spacingProps = useSpacingProps(attributes);
	const shadowProps = useShadowProps(attributes);

	const blockProps = useBlockProps();

	const renderButton = () => {
		const showIcon = ['icon', 'both'].includes(button_type);
		const showText = ['text', 'both'].includes(button_type);

		return (
			<>
				{showIcon && 'before' === icon_position && (
					<ScIcon
						className="wp-block-surecart-product-review-add-button__icon"
						name={icon ?? 'edit-2'}
						width={icon_size}
						height={icon_size}
					/>
				)}
				{showText && (
					<PlainText
						__experimentalVersion={2}
						tagName="span"
						aria-label={__('Write a Review button')}
						placeholder={__('Write a Review')}
						value={label}
						onChange={(newLabel) =>
							setAttributes({ label: newLabel })
						}
					/>
				)}
				{showIcon && 'after' === icon_position && (
					<ScIcon
						className="wp-block-surecart-product-review-add-button__icon"
						name={icon ?? 'edit-2'}
						width={icon_size}
						height={icon_size}
					/>
				)}
			</>
		);
	};

	return (
		<>
			<InspectorControls>
				<Design attributes={attributes} setAttributes={setAttributes} />
			</InspectorControls>

			<div className="wp-block-buttons">
				<div
					{...blockProps}
					className={classnames(blockProps.className, {
						'wp-block-button': true,
						'sc-block-button': true,
						[`has-custom-width wp-block-button__width-${width}`]: width,
						[`has-custom-width sc-block-button__width-${width}`]: width,
					})}
				>
					<div
						className={classnames(
							'wp-block-button__link',
							'wp-element-button',
							'sc-button__link',
							colorProps.className,
							borderProps.className,
							spacingProps.className,
							shadowProps.className,
						)}
						style={{
							...borderProps.style,
							...spacingProps.style,
							...shadowProps.style,
							...colorProps.style,
							gap: getSpacingPresetCssVar(style?.spacing?.blockGap),
							justifyContent: style?.typography?.textAlign,
						}}
					>
						{renderButton()}
					</div>
				</div>
			</div>
		</>
	);
};

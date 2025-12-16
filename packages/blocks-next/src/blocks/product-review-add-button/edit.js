/**
 * WordPress dependencies.
 */
import {
	useBlockProps,
	PlainText,
	InspectorControls,
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

	const blockProps = useBlockProps({
		className: 'wp-block-buttons',
		style: {
			gap: getSpacingPresetCssVar(style?.spacing?.blockGap),
			justifyContent: style?.typography?.textAlign,
		},
	});

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
					className={classnames({
						'wp-block-button': true,
						'sc-block-button': true,
						[`has-custom-width wp-block-button__width-${width}`]:
							width,
						[`has-custom-width sc-block-button__width-${width}`]:
							width,
					})}
				>
					<div
						{...blockProps}
						className={classnames(blockProps.className, {
							'wp-block-button__link': true,
						})}
					>
						{renderButton()}
					</div>
				</div>
			</div>
		</>
	);
};

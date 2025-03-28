/**
 * WordPress dependencies
 */
import {
	useBlockProps,
	PlainText,
	InspectorControls,
} from '@wordpress/block-editor';
import { PanelBody } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import ScIcon from '../../components/ScIcon';
import { ProductQuickViewButtonControls } from './product-quick-view-button-controls';

export default ({
	attributes: { icon, quickViewButtonType, label },
	setAttributes,
}) => {
	const blockProps = useBlockProps();

	const renderButton = () => {
		const showIcon =
			quickViewButtonType === 'icon' || quickViewButtonType === 'both';
		const showText =
			quickViewButtonType === 'text' || quickViewButtonType === 'both';

		return (
			<>
				{showText && (
					<PlainText
						__experimentalVersion={2}
						tagName="span"
						aria-label={__('Quick view button')}
						placeholder={__('Quick View')}
						value={label}
						onChange={(newLabel) =>
							setAttributes({ label: newLabel })
						}
					/>
				)}
				{showIcon && <ScIcon name={icon} />}
			</>
		);
	};

	return (
		<>
			<InspectorControls>
				<PanelBody title={__('Settings')}>
					<ProductQuickViewButtonControls
						value={quickViewButtonType}
						onChange={(value) => {
							setAttributes({ quickViewButtonType: value });
						}}
					/>
				</PanelBody>
			</InspectorControls>
			<div {...blockProps}>{renderButton()}</div>
		</>
	);
};

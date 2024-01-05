/**
 * External dependencies
 */
import classnames from 'classnames';
import {
	AlignmentControl,
	BlockControls,
	InspectorControls,
	RichText,
	useBlockProps,
} from '@wordpress/block-editor';
import {
	PanelBody,
	PanelRow,
	TextControl,
	ToggleControl,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { ScUpsellCountdownTimer } from '@surecart/components-react';
import useProductPageWarning from '../../../hooks/useProductPageWarning';

export default ({
	attributes: { textAlign, offer_expire_text, show_icon },
	setAttributes,
}) => {
	const blockProps = useBlockProps({
		className: classnames({
			[`has-text-align-${textAlign}`]: textAlign,
		}),
	});

	const warning = useProductPageWarning();
	if (warning) {
		return <div {...blockProps}>{warning}</div>;
	}

	return (
		<>
			<BlockControls group="block">
				<AlignmentControl
					value={textAlign}
					onChange={(nextAlign) => {
						setAttributes({ textAlign: nextAlign });
					}}
				/>
			</BlockControls>

			<InspectorControls>
				<PanelBody title={__('Text settings', 'surecart')}>
					<PanelRow>
						<TextControl
							label={__('Offer expires label', 'surecart')}
							placeholder={__('Offer expires in', 'surecart')}
							value={offer_expire_text}
							onChange={(value) =>
								setAttributes({ offer_expire_text: value })
							}
						/>
					</PanelRow>
					<PanelRow>
						<ToggleControl
							label={__('Show clock icon', 'surecart')}
							checked={show_icon}
							onChange={() =>
								setAttributes({ show_icon: !show_icon })
							}
						/>
					</PanelRow>
				</PanelBody>
			</InspectorControls>

			<div {...blockProps}>
				<ScUpsellCountdownTimer showIcon={show_icon}>
					<span slot="offer-expire-text">
						<RichText
							tagName="span"
							aria-label={__('Offer Expire text', 'surecart')}
							placeholder={__('Offer Expires in', 'surecart')}
							value={offer_expire_text}
							onChange={(offer_expire_text) =>
								setAttributes({ offer_expire_text })
							}
							withoutInteractiveFormatting
							allowedFormats={['core/bold', 'core/italic']}
						/>
					</span>
				</ScUpsellCountdownTimer>
			</div>
		</>
	);
};

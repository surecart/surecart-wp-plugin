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
import { ScOrderBumpCountdownTimer } from '@surecart/components-react';
import useProductPageWarning from '../../../hooks/useProductPageWarning';

export default ({
	attributes: { textAlign, offer_expire_text, redirect_url, show_icon },
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
						<TextControl
							label={__('No thanks Redirect URL', 'surecart')}
							placeholder={__(
								'Enter no thanks redirect URL',
								'surecart'
							)}
							value={redirect_url}
							onChange={(value) =>
								setAttributes({ redirect_url: value })
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
				<ScOrderBumpCountdownTimer showIcon={show_icon}>
					<div slot="offer-expire-text">
						<RichText
							aria-label={__('Offer Expire text', 'surecart')}
							placeholder={__('Offer Expires in', 'surecart')}
							value={offer_expire_text}
							onChange={(offer_expire_text) =>
								setAttributes({ offer_expire_text })
							}
							withoutInteractiveFormatting
							allowedFormats={['core/bold', 'core/italic']}
						/>
					</div>
				</ScOrderBumpCountdownTimer>
			</div>
		</>
	);
};

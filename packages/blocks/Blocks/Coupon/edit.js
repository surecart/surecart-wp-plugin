/** @jsx jsx */
import { css, jsx } from '@emotion/core';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Fragment } from '@wordpress/element';
import { InspectorControls } from '@wordpress/block-editor';
import {
	PanelBody,
	PanelRow,
	TextControl,
	ToggleControl,
	Disabled,
} from '@wordpress/components';
import { useBlockProps } from '@wordpress/block-editor';

/**
 * Component Dependencies
 */
import { ScCouponForm } from '@surecart/components-react';

export default ({ attributes, setAttributes, isSelected }) => {
	const { text, button_text, disabled, collapsed, placeholder } = attributes;
	const blockProps = useBlockProps({
		style: {
			opacity: disabled ? 0.5 : 1,
		},
	});

	return (
		<Fragment>
			<InspectorControls>
				<PanelBody title={__('Attributes', 'surecart')}>
					<PanelRow>
						<ToggleControl
							label={__('Collapsed', 'surecart')}
							checked={collapsed}
							onChange={(collapsed) =>
								setAttributes({ collapsed })
							}
						/>
					</PanelRow>
					<PanelRow>
						<TextControl
							label={__('Label', 'surecart')}
							value={text}
							onChange={(text) => setAttributes({ text })}
						/>
					</PanelRow>
					<PanelRow>
						<TextControl
							label={__('Placeholder', 'surecart')}
							value={placeholder}
							onChange={(placeholder) =>
								setAttributes({ placeholder })
							}
						/>
					</PanelRow>
					<PanelRow>
						<TextControl
							label={__('Button Text', 'surecart')}
							value={button_text}
							onChange={(button_text) =>
								setAttributes({ button_text })
							}
						/>
					</PanelRow>
				</PanelBody>
			</InspectorControls>

			<div {...blockProps}>
				<Disabled>
					<ScCouponForm
						forceOpen={isSelected}
						collapsed={collapsed}
						placeholder={placeholder}
						label={text}
					>
						{button_text}
					</ScCouponForm>
				</Disabled>
			</div>
		</Fragment>
	);
};

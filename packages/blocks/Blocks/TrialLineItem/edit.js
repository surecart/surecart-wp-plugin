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
	Disabled,
} from '@wordpress/components';
import { useBlockProps } from '@wordpress/block-editor';

export default ({ attributes, setAttributes }) => {
	const { disabled } = attributes;
	const blockProps = useBlockProps({
		style: {
			opacity: disabled ? 0.5 : 1,
		},
	});

	return (
		<Fragment>
			<InspectorControls>
				<PanelBody title={__('Trial Line Item Settings')}>
					<PanelRow>
						<TextControl
							label={__('Label')}
							value={attributes.label}
							onChange={(label) => setAttributes({ label })}
						/>
					</PanelRow>
				</PanelBody>
			</InspectorControls>
			<div {...blockProps}>
				<Disabled>
					<sc-trial-line-item
						label={attributes.label}
					></sc-trial-line-item>
				</Disabled>
			</div>
		</Fragment>
	);
};

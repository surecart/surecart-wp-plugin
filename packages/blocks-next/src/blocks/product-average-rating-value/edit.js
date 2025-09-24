/**
 * WordPress dependencies.
 */
import {
	useBlockProps,
	InspectorControls,
} from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import { PanelBody, TextControl } from '@wordpress/components';

export default ( { attributes, setAttributes } ) => {
	const { prefix, suffix } = attributes;
	const blockProps = useBlockProps();
	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Settings', 'surecart' ) }>
					<TextControl
						label={ __( 'Prefix', 'surecart' ) }
						value={ prefix }
						onChange={ ( value ) =>
							setAttributes( { prefix: value } )
						}
					/>
					<TextControl
						label={ __( 'Suffix', 'surecart' ) }
						value={ suffix }
						onChange={ ( value ) =>
							setAttributes( { suffix: value } )
						}
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...blockProps }>
				{ prefix }
				{ __( '4.5', 'surecart' ) }
				{ suffix }
			</div>
		</>
	);
};

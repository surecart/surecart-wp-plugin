/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';

import {
	RangeControl,
	PanelBody,
	PanelRow,
	RadioControl,
} from '@wordpress/components';

export default ( { attributes, setAttributes } ) => {
	const { columns, type } = attributes;

	return (
		<InspectorControls>
			<PanelBody title={ __( 'Attributes', 'checkout_engine' ) }>
				<PanelRow>
					<RadioControl
						label={ __( 'Type', 'checkout_engine' ) }
						help="The type of product selection"
						selected={ type }
						options={ [
							{
								label: __( 'Choose one', 'checkout_egine' ),
								value: 'radio',
							},
							{
								label: __( 'Choose many', 'checkout_engine' ),
								value: 'checkbox',
							},
						] }
						onChange={ ( type ) => setAttributes( { type } ) }
					/>
				</PanelRow>
				<PanelRow>
					<RangeControl
						label={ __( 'Columns', 'checkout_engine' ) }
						value={ columns }
						onChange={ ( columns ) => setAttributes( { columns } ) }
						min={ 1 }
						max={ 3 }
					/>
				</PanelRow>
			</PanelBody>
		</InspectorControls>
	);
};

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { RichText } from '@wordpress/block-editor';
import InnerBlocks from '../../../components/InnerBlocks';
import Inspector from './components/Inspector';

/**
 * Component Dependencies
 */
import { CePriceChoices, CeFormSection } from '@checkout-engine/react';

export default ( { className, attributes, setAttributes, isSelected } ) => {
	const {
		default: defaultChoice,
		products,
		columns,
		type,
		label,
		description,
	} = attributes;

	return (
		<div>
			<Inspector
				attributes={ attributes }
				setAttributes={ setAttributes }
			/>
			<CeFormSection>
				<RichText
					slot="label"
					aria-label={ __( 'Label' ) }
					placeholder={ __( 'Add a title' ) }
					value={ label }
					onChange={ ( value ) => setAttributes( { label: value } ) }
					withoutInteractiveFormatting
					allowedFormats={ [ 'core/bold', 'core/italic' ] }
				/>
				<RichText
					slot="description"
					aria-label={ __( 'Description' ) }
					placeholder={ __( 'Add a description' ) }
					value={ description }
					onChange={ ( value ) =>
						setAttributes( { description: value } )
					}
					withoutInteractiveFormatting
					allowedFormats={ [ 'core/bold', 'core/italic' ] }
				/>

				<CePriceChoices
					columns={ columns }
					type={ type }
					default={ defaultChoice }
				></CePriceChoices>

				<InnerBlocks templateLock={ false } />
			</CeFormSection>
		</div>
	);
};

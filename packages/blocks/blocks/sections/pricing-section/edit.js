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
import { CeChoices, CeChoice, CeFormSection } from '@checkout-engine/react';

export default ( { className, attributes, setAttributes, isSelected } ) => {
	const {
		default: defaultChoice,
		products,
		columns,
		type,
		label,
		description,
	} = attributes;

	const productsSelector = () => {
		// if ( ! products?.length ) {
		// 	return <p>Please add a product.</p>;
		// }

		return (
			<CeChoices
				className={ className }
				style={ { '--columns': columns } }
			>
				<CeChoice name="plan" type={ type } required checked>
					Gold Plan
					<span slot="description">$9.99, then $49.99 per month</span>
				</CeChoice>
				<CeChoice name="plan" type={ type } required>
					Silver Plan
					<span slot="description">$39.99 per month</span>
				</CeChoice>
			</CeChoices>
		);
	};

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

				{ productsSelector() }

				<InnerBlocks templateLock={ false } />
			</CeFormSection>
		</div>
	);
};

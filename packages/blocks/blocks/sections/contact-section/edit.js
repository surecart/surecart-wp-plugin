/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { RichText } from '@wordpress/block-editor';
import { IconButton } from '@wordpress/components';
import { InnerBlocks, Inserter } from '@wordpress/block-editor';

/**
 * Component Dependencies
 */
import { CeFormRow, CeInput, CeFormSection } from '@checkout-engine/react';

export default ( {
	className,
	attributes,
	setAttributes,
	isSelected,
	clientId,
} ) => {
	const { label, description } = attributes;

	function MyButtonBlockAppender( { rootClientId } ) {
		return (
			<Inserter
				rootClientId={ rootClientId }
				renderToggle={ ( { onToggle, disabled } ) => (
					<IconButton
						className="my-button-block-appender"
						onClick={ onToggle }
						disabled={ disabled }
						label="Add a Block"
						icon="plus"
					/>
				) }
				isAppender
			/>
		);
	}

	return (
		<CeFormSection label="Card Details">
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

			<InnerBlocks
				templateLock={ 'insert' }
				template={ [
					[
						'checkout-engine/email',
						{
							label: 'Email Address',
						},
					],
					[
						'checkout-engine/name',
						{
							firstnameLabel: 'First Name',
							firstnameHelp: 'Optional',
							lastnameLabel: 'Last Name',
							lastnameHelp: 'Optional',
						},
					],
				] }
			/>
		</CeFormSection>
	);
};

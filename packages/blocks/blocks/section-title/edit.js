import { __ } from '@wordpress/i18n';
import { RichText } from '@wordpress/block-editor';
import { useBlockProps } from '@wordpress/block-editor';

export default ( { attributes, setAttributes, isSelected } ) => {
	const { text, description } = attributes;

	const blockProps = useBlockProps( {
		className: 'ce-section-title',
	} );

	return (
		<div { ...blockProps }>
			<ce-text
				tag="h2"
				style={ {
					'--font-size': 'var(--ce-form-title-font-size)',
					'--font-weight': 'var(--ce-form-title-font-weight)',
					'--color': 'var(--ce-form-title-font-color)',
				} }
			>
				<RichText
					aria-label={ __( 'Title', 'checkout_engine' ) }
					placeholder={ __( 'Add your title...', 'checkout_engine' ) }
					value={ text }
					onChange={ ( text ) => setAttributes( { text } ) }
					withoutInteractiveFormatting
					allowedFormats={ [ 'core/bold', 'core/italic' ] }
				/>
			</ce-text>
			{ ( isSelected || description ) && (
				<ce-text
					tag="p"
					style={ {
						marginTop: 'var(--ce-spacing-small)',
						'--font-size': 'var(--ce-form-title-description-size)',
						'--color': 'var(--ce-form-title-description-color)',
					} }
				>
					<RichText
						aria-label={ __( 'Description', 'checkout_engine' ) }
						placeholder={ __(
							'Add a description...',
							'checkout_engine'
						) }
						value={ description }
						onChange={ ( description ) =>
							setAttributes( { description } )
						}
						withoutInteractiveFormatting
						allowedFormats={ [ 'core/bold', 'core/italic' ] }
					/>
				</ce-text>
			) }
		</div>
	);
};

import { useBlockProps } from '@wordpress/block-editor';

export default ( { attributes } ) => {
	const { text, description } = attributes;

	const blockProps = useBlockProps.save( {
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
				{ text }
			</ce-text>
			{ description && (
				<ce-text
					tag="p"
					style={ {
						marginTop: 'var(--ce-spacing-small)',
						'--font-size': 'var(--ce-form-title-description-size)',
						'--color': 'var(--ce-form-title-description-color)',
					} }
				>
					{ description }
				</ce-text>
			) }
		</div>
	);
};

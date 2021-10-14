/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import { dispatch } from '@wordpress/data';
import { useBlockProps } from '@wordpress/block-editor';
import { Spinner, Placeholder } from '@wordpress/components';
import {
	createBlock,
	parse,
	serialize,
	createBlocksFromInnerBlocksTemplate,
} from '@wordpress/blocks';

/**
 * Templates
 */
import * as templates from '../../templates';

/**
 * Components
 */
import Setup from './components/Setup';
import Edit from './components/Edit';

export default ( { attributes, setAttributes } ) => {
	// these blocks are required in order to submit an order
	const [ loading, setLoading ] = useState( false );

	// TODO: Let's store a unique hash in both meta and attribute to find.
	const { id, title: titleAttribute, choices } = attributes;

	const blockProps = useBlockProps();

	// save the form block.
	const saveFormBlock = async () => {
		setLoading( true );
		try {
			const updatedRecord = await dispatch( 'core' ).saveEntityRecord(
				'postType',
				'ce_form',
				{
					title: titleAttribute || __( 'Test' ),
					content: serialize(
						createBlock(
							'checkout-engine/form', // name
							{
								choices, // attributes
							},
							createBlocksFromInnerBlocksTemplate(
								parse( templates.sections )
							)
						)
					),
					status: 'publish',
				}
			);
			setAttributes( { id: updatedRecord.id } );
		} catch ( e ) {
			// TODO: Add notice here.
			console.error( e );
		} finally {
			setLoading( false );
		}
	};

	if ( loading ) {
		return (
			<div { ...blockProps }>
				<Placeholder>
					<Spinner />
				</Placeholder>
			</div>
		);
	}

	if ( ! id ) {
		return (
			<Setup
				attributes={ attributes }
				setAttributes={ setAttributes }
				onCreate={ saveFormBlock }
			/>
		);
	} else {
		return (
			<Edit attributes={ attributes } setAttributes={ setAttributes } />
		);
	}
};

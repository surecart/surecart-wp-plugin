/** @jsx jsx */
import { css, jsx } from '@emotion/core';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Placeholder, Button } from '@wordpress/components';
import { useState, Fragment } from '@wordpress/element';
import { dispatch } from '@wordpress/data';
import {
	createBlock,
	parse,
	serialize,
	createBlocksFromInnerBlocksTemplate,
} from '@wordpress/blocks';

import { receipt as icon } from '@wordpress/icons';

/**
 * Templates
 */
import * as templates from '../../../templates';

/**
 * Components
 */
import Setup from './Setup';
import SelectForm from './SelectForm';

export default ( { attributes, setAttributes } ) => {
	const { id, title, loading, step } = attributes;
	const [ form, setForm ] = useState( {} );

	// save the form block.
	const saveFormBlock = async () => {
		setAttributes( { loading: true } );
		try {
			const updatedRecord = await dispatch( 'core' ).saveEntityRecord(
				'postType',
				'ce_form',
				{
					title: title || __( 'Untitled Form', 'checkout_engine' ),
					content: serialize(
						createBlock(
							'checkout-engine/form', // name
							{
								...attributes,
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
			setAttributes( { loading: false } );
		}
	};

	return (
		<Fragment>
			{ ! step && (
				<Placeholder
					icon={ icon }
					instructions={ __(
						'Get started by selecting a form or start build a new form.',
						'checkout_engine'
					) }
					label={ __( 'Add a checkout form', 'checkout_engine' ) }
				>
					<div>
						<Button
							isPrimary
							onClick={ () => setAttributes( { step: 'new' } ) }
						>
							{ __( 'New Form', 'checkout_engine' ) }
						</Button>
						<Button
							isSecondary
							onClick={ () =>
								setAttributes( { step: 'select' } )
							}
						>
							{ __( 'Select Form', 'checkout_engine' ) }
						</Button>
					</div>
				</Placeholder>
			) }

			{ step === 'new' && (
				<Setup
					attributes={ attributes }
					setAttributes={ setAttributes }
					onCreate={ saveFormBlock }
					isNew={ true }
					onCancel={ () => setAttributes( { step: null } ) }
				/>
			) }

			{ step === 'select' && (
				<Placeholder
					icon={ icon }
					label={ __( 'Select a checkout form', 'checkout_engine' ) }
				>
					<div>
						<SelectForm form={ form } setForm={ setForm } />
						<Button
							isPrimary
							onClick={ () => {
								console.log( { form } );
								setAttributes( { id: form?.id } );
							} }
						>
							{ __( 'Choose', 'checkout_engine' ) }
						</Button>
						<Button
							onClick={ () => setAttributes( { step: null } ) }
						>
							{ __( 'Cancel', 'checkout_engine' ) }
						</Button>
					</div>
				</Placeholder>
			) }
		</Fragment>
	);
};

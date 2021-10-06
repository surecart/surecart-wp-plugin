/** @jsx jsx */

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
/**
 * WordPress dependencies
 */
import { serialize } from '@wordpress/blocks';

/**
 * Component Dependencies
 */
import { Placeholder, TextControl } from '@wordpress/components';

import { css, jsx } from '@emotion/core';
import { useState } from '@wordpress/element';
import { useSelect, select, dispatch } from '@wordpress/data';
import {
	__experimentalUseInnerBlocksProps as useInnerBlocksProps,
	__experimentalUseNoRecursiveRenders as useNoRecursiveRenders,
	__experimentalBlockContentOverlay as BlockContentOverlay, // TODO when gutenberg releases it: https://github.com/WordPress/gutenberg/blob/afee31ee020b8965e811f5d68a5ca8001780af9d/packages/block-editor/src/components/block-content-overlay/index.js#L17
	InspectorControls,
	useBlockProps,
	Warning,
} from '@wordpress/block-editor';
import { PanelBody, PanelRow, Spinner } from '@wordpress/components';

// stores
import {
	useEntityBlockEditor,
	useEntityProp,
	store as coreStore,
} from '@wordpress/core-data';
import { store as noticesStore } from '@wordpress/notices';
import { store as blockEditorStore } from '@wordpress/block-editor';

export default ( { clientId, attributes, setAttributes } ) => {
	// these blocks are required in order to submit an order
	const [ loading, setLoading ] = useState( false );
	// TODO: Let's store a unique hash in both meta and attribute to find.
	const { id, className } = attributes;
	const [ hasAlreadyRendered, RecursionProvider ] = useNoRecursiveRenders(
		id
	);

	const [ blocks, onInput, onChange ] = useEntityBlockEditor(
		'postType',
		'ce_form',
		{ id }
	);
	const [ title, setTitle ] = useEntityProp(
		'postType',
		'ce_form',
		'title',
		id
	);

	const blockProps = useBlockProps();

	const innerBlocksProps = useInnerBlocksProps(
		{},
		{
			value: blocks,
			onInput,
			onChange,
			template: [ [ 'checkout-engine/form', {} ] ],
			renderAppender: false,
		}
	);

	const { isMissing, form, hasResolved, canEdit } = useSelect( ( select ) => {
		const hasResolved = select(
			coreStore
		).hasFinishedResolution( 'getEntityRecord', [
			'postType',
			'ce_form',
			id,
		] );
		const form = select( coreStore ).getEntityRecord(
			'postType',
			'ce_form',
			id
		);
		const canEdit = select( coreStore ).canUserEditEntityRecord(
			'ce_form'
		);
		return {
			canEdit,
			isMissing: hasResolved && ! form,
			hasResolved,
			form,
		};
	} );

	// save the form block.
	const saveFormBlock = async ( title ) => {
		setLoading( true );
		try {
			const updatedRecord = await dispatch( 'core' ).saveEntityRecord(
				'postType',
				'ce_form',
				{
					title: title || __( 'Untitled Form' ),
					content: serialize(
						select( blockEditorStore ).getBlocksByClientId(
							clientId
						)
					),
					status: 'publish',
				}
			);
			setAttributes( { id: updatedRecord.id } );
			dispatch( 'core' ).saveEntityRecord();
		} catch ( e ) {
			// TODO: Add notice here.
			console.error( e );
		} finally {
			setLoading( false );
		}
	};

	if ( hasAlreadyRendered ) {
		return (
			<div { ...blockProps }>
				<Warning>
					{ __(
						'Form cannot be rendered inside itself.',
						'checkout_engine'
					) }
				</Warning>
			</div>
		);
	}

	if ( ! hasResolved ) {
		return (
			<div { ...blockProps }>
				<Placeholder>
					<Spinner />
				</Placeholder>
			</div>
		);
	}

	if ( isMissing ) {
		return (
			<div { ...blockProps }>
				<Warning>
					{ __(
						'This form has been deleted or is unavailable.',
						'checkout_engine'
					) }
				</Warning>
			</div>
		);
	}

	if ( ! form ) {
		return (
			<button onClick={ () => saveFormBlock( 'Form' ) }>Save Form</button>
		);
	}

	return (
		<RecursionProvider>
			<InspectorControls>
				<PanelBody title={ __( 'Form Title', 'checkout-engine' ) }>
					<PanelRow>
						<TextControl
							label={ __( 'Form Title', 'checkout-engine' ) }
							value={ title }
							onChange={ ( title ) => setTitle( title ) }
						/>
					</PanelRow>
				</PanelBody>
			</InspectorControls>

			<div className="block-library-block__reusable-block-container">
				{ <div { ...innerBlocksProps } /> }
			</div>
		</RecursionProvider>
	);
};

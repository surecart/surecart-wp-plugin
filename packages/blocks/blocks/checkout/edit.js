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
import { TabPanel, Placeholder, TextControl } from '@wordpress/components';

/**
 * React components
 */
import FormBlocks from './components/form-blocks';

import { css, jsx } from '@emotion/core';
import Options from './components/Options';
import { useCallback, useState, useEffect } from '@wordpress/element';
import { useDispatch, useSelect, select, dispatch } from '@wordpress/data';
import {
	__experimentalUseInnerBlocksProps as useInnerBlocksProps,
	__experimentalUseNoRecursiveRenders as useNoRecursiveRenders,
	__experimentalBlockContentOverlay as BlockContentOverlay,
	InnerBlocks,
	BlockControls,
	InspectorControls,
	useBlockProps,
	Warning,
} from '@wordpress/block-editor';
import {
	PanelBody,
	PanelRow,
	FontSizePicker,
	Spinner,
} from '@wordpress/components';

// stores
import {
	useEntityBlockEditor,
	useEntityProp,
	store as coreStore,
} from '@wordpress/core-data';
import { store as noticesStore } from '@wordpress/notices';
import { store as blockEditorStore } from '@wordpress/block-editor';
import { store as reusableBlocksStore } from '@wordpress/reusable-blocks';

export default ( { clientId, attributes, setAttributes } ) => {
	// these blocks are required in order to submit an order
	const [ loading, setLoading ] = useState( false );
	const { id, align } = attributes;

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
	const [ meta, setMeta ] = useEntityProp(
		'postType',
		'ce_form',
		'meta',
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

	useEffect( () => {
		setMeta( { align } );
	}, [ align ] );

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
			console.error( e );
		} finally {
			setLoading( false );
		}
	};

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
		<div
			className={ meta?.className }
			css={ css`
				font-size: 14px;
			` }
		>
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
		</div>
	);
};

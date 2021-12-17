/**
 * WordPress dependencies
 */
import { sprintf, __ } from '@wordpress/i18n';
import {
	useBlockProps,
	store as blockEditorStore,
	__experimentalUseInnerBlocksProps as useInnerBlocksProps,
} from '@wordpress/block-editor';
import { useSelect, useDispatch } from '@wordpress/data';
import { useEffect, useRef } from '@wordpress/element';
import { createBlock } from '@wordpress/blocks';

export default ( { clientId } ) => {
	const { updateBlockAttributes, insertBlocks } = useDispatch(
		blockEditorStore
	);

	const blockProps = useBlockProps();

	const innerBlocksProps = useInnerBlocksProps( blockProps, {
		orientation: 'horizontal',
		templateLock: 'all',
		renderAppender: false,
	} );

	const { tabBlocks, panelBlocks, panelsWrapper } = useSelect( ( select ) => {
		const innerBlocks = select( 'core/block-editor' ).getBlocks( clientId );
		const tabsWrapper = innerBlocks.find(
			( block ) => block.name === 'checkout-engine/dashboard-tabs'
		);
		const panelsWrapper = innerBlocks.find(
			( block ) => block.name === 'checkout-engine/dashboard-pages'
		);
		return {
			tabsWrapper,
			panelsWrapper,
			tabBlocks: select( 'core/block-editor' ).getBlocks(
				tabsWrapper.clientId
			),
			panelBlocks: select( 'core/block-editor' ).getBlocks(
				panelsWrapper.clientId
			),
		};
	} );

	const previousTabBlocks = useRef( tabBlocks );

	useEffect( () => {
		// sync panel
		tabBlocks.forEach( ( tabBlock ) => {
			const panelBlock = panelBlocks.find(
				( panelBlock ) =>
					panelBlock.attributes.id === tabBlock.attributes.id
			);
			if ( panelBlock ) {
				updateBlockAttributes( panelBlock.clientId, {
					name: tabBlock.attributes.panel,
				} );
			}
		} );

		// added. Add a panel
		if ( previousTabBlocks.current.length < tabBlocks.length ) {
			const addedTab = tabBlocks.find(
				( tab ) =>
					! previousTabBlocks.current.find(
						( previousTab ) => previousTab.clientId === tab.clientId
					)
			);

			const title = sprintf(
				__( 'New Tab %d', 'checkout_engine' ),
				tabBlocks.length
			);

			const name = title
				.toLowerCase()
				.replace( / /g, '-' )
				.replace( /[^\w-]+/g, '' );

			updateBlockAttributes( addedTab.clientId, {
				id: addedTab.clientId,
				title: title,
				active: true,
				panel: name,
			} );

			const panel = createBlock( 'checkout-engine/dashboard-page', {
				id: addedTab.clientId,
				name,
				title,
			} );

			console.log( { panel } );

			insertBlocks( panel, 0, panelsWrapper.clientId );
		}

		previousTabBlocks.current = tabBlocks;
	}, [ tabBlocks ] );

	return <ce-tab-group { ...innerBlocksProps }></ce-tab-group>;
};

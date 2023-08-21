import apiFetch from '@wordpress/api-fetch';
import { useState, useEffect } from '@wordpress/element';
import { createNavigationLink } from './use-convert-to-navigation-links';
import { useSelect, useDispatch } from '@wordpress/data';
import { Popover, Button, TextControl, ToggleControl, Modal } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { 
	store as blockEditorStore, 
	useBlockProps, __experimentalLinkControl as LinkControl
} from '@wordpress/block-editor';
import ModelSelector from '../../../admin/components/ModelSelector';
import { css, jsx } from '@emotion/core';
import { ScBlockUi } from '@surecart/components-react';

export default ({ clientId }) => {
	
	const [collectionPage, setCollectionPage] = useState(null);
	const [modal, setModal] = useState(false);
	const [parentMenuName, setParentMenuName] = useState('');
	const [addInParentMenu, setAddInParentMenu] = useState(false);
	const { replaceBlock, selectBlock, removeBlock } = useDispatch( blockEditorStore );
	const blockProps = useBlockProps();
	const {
		parentClientId,
	} = useSelect(
		( select ) => {
			const {
				getBlockParentsByBlockName,
			} = select( blockEditorStore );
			const navigationBlockParents = getBlockParentsByBlockName(
				clientId,
				'core/navigation',
				true
			);
			return {
				parentClientId: navigationBlockParents[ 0 ],
			};
		},
		[ clientId ]
	);

	useEffect(() => {
		if ( ! collectionPage ) {
			setModal(true);
		}
	}, []);

	useEffect(() => {
		if ( collectionPage ) {
			console.log(collectionPage);
		}
	}, [collectionPage]);

	const getCollectionPage = async (id) => {
		console.log(id);
		const collectionPage = await apiFetch({
			path: `/surecart/v1/product_collections/${id}`,
		});
		console.log(collectionPage);
		useConvertToNavigationLinks({clientId, collectionPage, parentClientId});
	};

	const useConvertToNavigationLinks = ( {
		clientId,
		collectionPage,
		parentClientId,
	} ) => {
		console.log(collectionPage);
		const navigationLink = createNavigationLink( collectionPage );
console.log(navigationLink);
		// Replace the Page List block with the Navigation Links.
		replaceBlock( clientId, navigationLink );

		// Select the Navigation block to reveal the changes.
		selectBlock( parentClientId );
	}

	return (
		<>
			{ !collectionPage && (
				<div {...blockProps} onClick={() => setModal(true)}>
					{__('Select a Collection Page...', 'surecart')}
				</div>
			)}
			{modal && (
				<Popover
					placement="bottom"
					shift
					resize={false}
					className='sc-collection-page-popover'
				>
					<ModelSelector
						placeholder={__(
							'Select a Collection Page',
							'surecart'
						)}
						placement={'bottom-end'}
						name="product-collection"
						onSelect={(collectionId) => {
							setModal(false);
							getCollectionPage(collectionId);
						}}
						style={{ width: '100%' }}
					/>
					
				</Popover>
			)}
		</>
	);
};

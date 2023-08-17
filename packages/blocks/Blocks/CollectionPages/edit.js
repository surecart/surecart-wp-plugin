import apiFetch from '@wordpress/api-fetch';
import { useState, useEffect } from '@wordpress/element';
import { createNavigationLinks } from './use-convert-to-navigation-links';
import { useSelect, useDispatch } from '@wordpress/data';
import { store as blockEditorStore } from '@wordpress/block-editor';
import { Modal, Button, TextControl, ToggleControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

export default ({ clientId }) => {
	
	const [collectionPages, setCollectionPages] = useState(null);
	const [newModal, setNewModal] = useState(false);
	const [parentMenuName, setParentMenuName] = useState('');
	const [addInParentMenu, setAddInParentMenu] = useState(false);
	const { replaceBlock, selectBlock, removeBlock } = useDispatch( blockEditorStore );
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
		getCollectionPages();
	}, []);

	useEffect(() => {
		if ( collectionPages ) {
			setNewModal(true);
		}
	}, [collectionPages]);

	const getCollectionPages = async () => {
		const pages = await apiFetch({
			path: '/surecart/v1/product_collections',
		});
		setCollectionPages(pages);
	};

	const useConvertToNavigationLinks = ( {
		clientId,
		collectionPages,
		parentClientId,
	} ) => {
		const navigationLinks = createNavigationLinks( collectionPages, parentMenuName );

		// Replace the Page List block with the Navigation Links.
		replaceBlock( clientId, navigationLinks );

		// Select the Navigation block to reveal the changes.
		selectBlock( parentClientId );
	}

	return (
		<>
		{newModal && (
			<Modal
				title={__('Add Collection Pages', 'surecart')}
				shouldCloseOnClickOutside={false}
				onRequestClose={() => {
					removeBlock(clientId);
					selectBlock( parentClientId );
					setNewModal(true)
				}}
			>
				<div
					style={{marginTop: "1.6em", marginBottom: "1.6em"}}
				>
					<ToggleControl
						label={__('Parent Menu', 'surecart')}
						checked={addInParentMenu}
						onChange={() => setAddInParentMenu(!addInParentMenu)}
						help={__('Add all Collection Pages inside a Parent Menu', 'surecart')}
					/>
					{
						addInParentMenu && (
							<TextControl
								label={__('Parent Menu Name', 'surecart')}
								value={parentMenuName}
								onChange={(label) => setParentMenuName(label)}	
							/>
						)
					}
				</div>
				<Button isPrimary onClick={() => {
					useConvertToNavigationLinks( {
						clientId,
						collectionPages,
						parentClientId
					} );
					setNewModal(false);
				}}>
					{__('Add', 'surecart')}
				</Button>
				<Button isTertiary onClick={() => {
					removeBlock(clientId);
					selectBlock(parentClientId);
					setNewModal(false);
				}}>
					{__('Cancel', 'surecart')}
				</Button>
			</Modal>
		)}
		</>
	);
};

import apiFetch from '@wordpress/api-fetch';
import { useState, useEffect, useRef } from '@wordpress/element';
import { createNavigationLink } from './use-convert-to-navigation-links';
import { useSelect, useDispatch } from '@wordpress/data';
import { Popover } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import {
	store as blockEditorStore,
	useBlockProps,
} from '@wordpress/block-editor';
import ModelSelector from '../../../admin/components/ModelSelector';

export default ({ clientId }) => {
	const anchorRef = useRef(null);
	const [collectionPage, setCollectionPage] = useState(null);
	const [modal, setModal] = useState(false);
	const [placeholderText, setPlaceholderText] = useState(
		__('Select Collection Page', 'surecart')
	);
	const [loadingPage, setLoadingPage] = useState(false);
	const { replaceBlock, selectBlock } = useDispatch(blockEditorStore);
	const blockProps = useBlockProps({
		ref: anchorRef,
	});
	const { parentClientId } = useSelect(
		(select) => {
			const { getBlockParentsByBlockName } = select(blockEditorStore);
			const navigationBlockParents = getBlockParentsByBlockName(
				clientId,
				'core/navigation',
				true
			);
			return {
				parentClientId: navigationBlockParents[0],
			};
		},
		[clientId]
	);

	useEffect(() => {
		if (!collectionPage) {
			setModal(true);
		}
	}, []);

	const getCollectionPage = async (id) => {
		const collectionPage = await apiFetch({
			path: `/surecart/v1/product_collections/${id}`,
		});
		setCollectionPage(collectionPage);
		useConvertToNavigationLinks({
			clientId,
			collectionPage,
			parentClientId,
		});
	};

	const useConvertToNavigationLinks = ({
		clientId,
		collectionPage,
		parentClientId,
	}) => {
		const navigationLink = createNavigationLink(collectionPage);

		// Replace the Page List block with the Navigation Links.
		replaceBlock(clientId, navigationLink);

		// Select the Navigation block to reveal the changes.
		selectBlock(parentClientId);
	};

	return (
		<>
			{(!collectionPage || loadingPage) && (
				<div
					ref={anchorRef}
					{...blockProps}
					onClick={() => setModal(true)}
					style={{
						cursor: 'pointer',
					}}
				>
					{placeholderText}
				</div>
			)}
			{modal && (
				<Popover
					placement="bottom"
					shift
					anchor={anchorRef.current}
					resize={false}
					onClose={() => setModal(false)}
				>
					<div
						style={{
							width: '20em',
						}}
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
								setLoadingPage(true);
								setPlaceholderText(
									__('Loading...', 'surecart')
								);
								getCollectionPage(collectionId);
							}}
							style={{ width: '100%' }}
							open={true}
							fetchOnLoad={true}
						/>
					</div>
				</Popover>
			)}
		</>
	);
};

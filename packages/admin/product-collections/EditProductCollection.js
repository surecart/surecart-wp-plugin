/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies.
 */
import {
	ScButton,
	ScDropdown,
	ScIcon,
	ScMenu,
	ScMenuItem,
} from '@surecart/components-react';
import Error from '../components/Error';
import useEntity from '../hooks/useEntity';
import Logo from '../templates/Logo';
import UpdateModel from '../templates/UpdateModel';
import Details from './modules/Details';
import DeleteModal from './modules/DeleteModal';
import SaveButton from '../templates/SaveButton';
import useSave from '../settings/UseSave';
import Image from './modules/Image';
import Box from '../ui/Box';
import Publishing from './modules/Publishing';

export default ({ id }) => {
	const [error, setError] = useState(null);
	const [modal, setModal] = useState(null);
	const { save } = useSave();
	const {
		item,
		editItem,
		itemError,
		saveError,
		savingItem,
		deleteItem,
		deletingItem,
		hasLoadedItem,
	} = useEntity('product-collection', id);

	/**
	 * Handle the form submission.
	 */
	const onSubmit = async () => {
		try {
			setError(null);
			save({ successMessage: __('Collection updated.', 'surecart') });
		} catch (e) {
			setError(e);
		}
	};

	const button = !hasLoadedItem ? (
		<sc-skeleton
			style={{
				width: '120px',
				height: '35px',
				display: 'inline-block',
			}}
		></sc-skeleton>
	) : (
		<div
			css={css`
				display: flex;
				align-items: center;
				gap: 0.5em;
			`}
		>
			<ScDropdown placement="bottom-end">
				<ScButton type="text" slot="trigger">
					<ScIcon name="more-horizontal" />
				</ScButton>
				<ScMenu>
					<ScMenuItem onClick={() => setModal('delete')}>
						{__('Delete', 'surecart')}
					</ScMenuItem>
				</ScMenu>
			</ScDropdown>
			<SaveButton busy={deletingItem || savingItem}>
				{__('Save Collection', 'surecart')}
			</SaveButton>
		</div>
	);

	return (
		<UpdateModel
			onSubmit={onSubmit}
			title={
				<div
					css={css`
						display: flex;
						align-items: center;
						gap: 1em;
					`}
				>
					<ScButton
						circle
						size="small"
						href="admin.php?page=sc-product-collections"
					>
						<sc-icon name="arrow-left"></sc-icon>
					</ScButton>
					<sc-breadcrumbs>
						<sc-breadcrumb>
							<Logo display="block" />
						</sc-breadcrumb>
						<sc-breadcrumb href="admin.php?page=sc-product-collections">
							{__('Collections', 'surecart')}
						</sc-breadcrumb>
						<sc-breadcrumb>
							<sc-flex style={{ gap: '1em' }}>
								{__('Edit Collection', 'surecart')}
							</sc-flex>
						</sc-breadcrumb>
					</sc-breadcrumbs>
				</div>
			}
			button={button}
			sidebar={
				<>
					<Publishing
						productCollection={item}
						updateProductCollection={editItem}
						loading={!hasLoadedItem}
					/>

					<Box title={__('Image', 'surecart')} loading={!hasLoadedItem}>
						<Image
							label={__('Image', 'surecart')}
							productCollection={item}
							updateProductCollection={editItem}
							loading={!hasLoadedItem}
						/>
					</Box>
				</>
			}
		>
			<>
				<Error
					error={saveError || itemError || error}
					setError={setError}
				/>

				<Details
					productCollection={item}
					updateProductCollection={editItem}
					loading={!hasLoadedItem}
				/>

				{modal === 'delete' && (
					<DeleteModal
						deleteItem={deleteItem}
						deletingItem={deletingItem}
						onClose={() => setModal(null)}
						setError={setError}
					/>
				)}
			</>
		</UpdateModel>
	);
};

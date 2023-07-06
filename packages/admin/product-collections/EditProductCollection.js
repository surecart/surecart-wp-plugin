/** @jsx jsx */
import { css, jsx } from '@emotion/core';

/**
 * External dependencies.
 */
import { useState } from '@wordpress/element';
import { useDispatch, useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import { store as noticesStore } from '@wordpress/notices';
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
	ScSkeleton,
} from '@surecart/components-react';
import Error from '../components/Error';
import Logo from '../templates/Logo';
import UpdateModel from '../templates/UpdateModel';
import Details from './modules/Details';
import DeleteModal from './modules/DeleteModal';
import SaveButton from '../templates/SaveButton';
import Image from './modules/Image';
import Box from '../ui/Box';
import Publishing from './modules/Publishing';

export default ({ id }) => {
	const [error, setError] = useState(null);
	const [modal, setModal] = useState(null);
	const { createSuccessNotice } = useDispatch(noticesStore);
	const { editEntityRecord, saveEntityRecord } = useDispatch(coreStore);

	const {
		productCollection,
		isLoading,
		isDeleting,
		isSaving,
		saveError,
		loadError,
	} = useSelect((select) => {
		const entityData = ['surecart', 'product-collection', id];

		return {
			productCollection: select(coreStore).getEditedEntityRecord(
				...entityData
			),
			isLoading: select(coreStore)?.isResolving?.(
				'getEditedEntityRecord',
				[...entityData]
			),
			isSaving: select(coreStore)?.isSavingEntityRecord?.(...entityData),
			isDeleting: select(coreStore)?.isDeletingEntityRecord?.(
				...entityData
			),
			saveError: select(coreStore)?.getLastEntitySaveError(...entityData),
			loadError: select(coreStore)?.getResolutionError?.(
				'getEditedEntityRecord',
				...entityData
			),
		};
	});

	/**
	 * Handle the form submission.
	 */
	const onSubmit = async (e) => {
		e.preventDefault();

		try {
			setError(null);
			await saveEntityRecord(
				'surecart',
				'product-collection',
				{
					id,
					...productCollection,
				},
				{
					throwOnError: true,
				}
			);
			createSuccessNotice(__('Collection updated.', 'surecart'), {
				type: 'snackbar',
			});
		} catch (e) {
			console.error(e);
			setError(e);
		}
	};

	const updateProductCollection = (data) => {
		editEntityRecord('surecart', 'product-collection', id, data);
	};

	const button = isLoading ? (
		<ScSkeleton
			style={{
				width: '120px',
				height: '35px',
				display: 'inline-block',
			}}
		></ScSkeleton>
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
			<SaveButton busy={isDeleting || isSaving}>
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
						productCollection={productCollection}
						updateProductCollection={updateProductCollection}
						loading={isLoading}
					/>

					<Box title={__('Image', 'surecart')} loading={isLoading}>
						<Image
							label={__('Image', 'surecart')}
							productCollection={productCollection}
							updateProductCollection={updateProductCollection}
							loading={isLoading}
						/>
					</Box>
				</>
			}
		>
			<>
				<Error
					error={saveError || loadError || error}
					setError={setError}
				/>

				<Details
					productCollection={productCollection}
					updateProductCollection={updateProductCollection}
					loading={isLoading}
				/>

				{modal === 'delete' && (
					<DeleteModal
						deleteItem={productCollection}
						deletingItem={isDeleting}
						onClose={() => setModal(null)}
						setError={setError}
					/>
				)}
			</>
		</UpdateModel>
	);
};

/** @jsx jsx */
import { css, jsx } from '@emotion/core';

/**
 * External dependencies.
 */
import { useState } from '@wordpress/element';
import { useDispatch, useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
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
import useSave from '../../admin/settings/UseSave';

export default ({ id }) => {
	const [error, setError] = useState(null);
	const [modal, setModal] = useState(null);
	const { editEntityRecord } = useDispatch(coreStore);
	const { save } = useSave();

	const { collection, isLoading, isDeleting, saveError, loadError } =
		useSelect((select) => {
			const entityData = ['surecart', 'product-collection', id];

			return {
				collection: select(coreStore).getEditedEntityRecord(
					...entityData
				),
				isLoading: select(coreStore)?.isResolving?.(
					'getEditedEntityRecord',
					[...entityData]
				),
				isDeleting: select(coreStore)?.isDeletingEntityRecord?.(
					...entityData
				),
				saveError: select(coreStore)?.getLastEntitySaveError(
					...entityData
				),
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
			await save({
				successMessage: __('Collection updated.', 'surecart'),
			});
		} catch (e) {
			console.error(e);
			setError(e);
		}
	};

	const updateCollection = (data) => {
		editEntityRecord('surecart', 'product-collection', id, data);
	};

	const button = isLoading ? (
		<ScSkeleton
			style={{
				width: '120px',
				height: '35px',
				display: 'inline-block',
			}}
		/>
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
			<SaveButton>{__('Save Collection', 'surecart')}</SaveButton>
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
						collection={collection}
						updateCollection={updateCollection}
						loading={isLoading}
					/>

					<Box title={__('Image', 'surecart')} loading={isLoading}>
						<Image
							label={__('Image', 'surecart')}
							collection={collection}
							updateCollection={updateCollection}
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
					collection={collection}
					updateCollection={updateCollection}
					loading={isLoading}
				/>

				{modal === 'delete' && (
					<DeleteModal
						deleteItem={collection}
						deletingItem={isDeleting}
						onClose={() => setModal(null)}
						setError={setError}
					/>
				)}
			</>
		</UpdateModel>
	);
};
